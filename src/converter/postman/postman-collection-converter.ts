import IOpenapiConverter from "@/converter/i-openapi-converter";
import PostmanImportFile from "@/type/postman/postman-import-file";
import OpenApiSpecification from "@/type/open-api/open-api-specification";
import ApiSpecification from "@/type/open-api/api-specification";
import {groupingAndThen, toMap} from "@/util/collection-util";
import PostmanInfo from "@/type/postman/postman-info";
import crypto from "crypto";
import IPostmanNode from "@/type/postman/i-postman-node";
import PostmanConvertConfigures from "@/converter/postman/postman-convert-configures";
import Path from "@/type/path";
import PostmanDirectory from "@/type/postman/postman-directory";
import PostmanRequest from "@/type/postman/postman-request";
import PostmanUrl from "@/type/postman/postman-url";
import PostmanBodyWrapper from "@/type/postman/postman-body-wrapper";
import Parameters from "@/type/open-api/protocol/parameters";
import PostmanFormdata from "@/type/postman/postman-formdata";
import Tag from "@/type/open-api/sub/tag";
import EmptyBody from "@/type/open-api/protocol/empty-body";
import IPostmanRequestBody from "@/type/postman/i-postman-request-body";
import IField from "@/type/open-api/sub/i-field";
import ObjectField from "@/type/open-api/sub/object-field";
import DefaultValue from "@/type/postman/constant/default-value";
import ValueField from "@/type/open-api/sub/value-field";
import CaseMode from "@/type/postman/constant/case-mode";
import Parameter from "@/type/open-api/sub/parameter";
import InType from "@/type/open-api/constant/in-type";
import PostmanPathVariable from "@/type/postman/postman-path-variable";

export default class PostmanCollectionConverter implements IOpenapiConverter {

    private readonly _openAPI: OpenApiSpecification;
    private readonly _group: Map<string, Map<string, ApiSpecification>>;
    private readonly _info: PostmanInfo;
    private readonly _nodes: Array<IPostmanNode>;
    private readonly _configures: PostmanConvertConfigures;
    private readonly _tagMap: Map<string, Tag>;
    private readonly _directoryMap: Map<string, PostmanDirectory>;

    public constructor(openAPI: OpenApiSpecification, configures: PostmanConvertConfigures) {
        this._openAPI = openAPI;
        this._group = groupingAndThen(
            openAPI.specs,
            (spec) => spec.path.value,
            (values) => toMap(values, (spec) => spec.method.value.toUpperCase())
        );
        this._info = new PostmanInfo(crypto.randomUUID(), openAPI.info.title, 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json', '23012590');
        this._nodes = [];
        this._configures = configures;
        this._tagMap = toMap(openAPI.tags, tag => {
            // extract end point from description
            const extractedTag = /\/[a-zA-Z_{}\/]+/g.exec(tag.description);
            if (extractedTag) {
                return extractedTag[0];
            }

            return tag.description;
        });
        this._directoryMap = new Map<string, PostmanDirectory>();
    }

    public convert(): PostmanImportFile {
        const filtered = this._openAPI.specs.filter(this.excludePathFilter);

        for (const spec of filtered) {
            const method = spec.method;
            const path = spec.path;

            const methodMap = this._group.get(path.value);
            const specification = methodMap?.get(method.value.toUpperCase())!;
            const existDirectory = this._directoryMap.has(path.value);

            const directory = existDirectory
                ? this._directoryMap.get(path.value)!
                : new PostmanDirectory(this.getDirectoryName(path), path.value, []);

            const postmanRequest = this.toPostmanRequest(specification);
            directory.addRequest(specification.summary, postmanRequest);

            //디렉토리가 없는 경우
            if (!existDirectory) {
                this._directoryMap.set(path.value, directory);
            }
        }

        return new PostmanImportFile(this._info, this.compactDirectories())
    }


    private readonly toPostmanRequest = (spec: ApiSpecification): PostmanRequest => {
        const pathVariables = spec.hasParameters ? this.extractPathVariables(spec.parameters!) : [];
        const url = new PostmanUrl(this._configures.host, spec, pathVariables);
        const body = this.extractRequestBody(spec);

        return new PostmanRequest(spec.method, this._configures.headers, url, body);
    }

    private readonly compactDirectories = (): Array<IPostmanNode> => {
        return [...this._directoryMap.entries()]
            .sort(([a], [b]) => a.localeCompare(b))
            .reduce((root, [key, value]) => {
                const path = new Path(key);
                const startDepth = 0;
                const rootChildPath = path.subset(startDepth);
                let foundChild = root.find(node => node instanceof PostmanDirectory && node.path.equals(rootChildPath)) as PostmanDirectory;

                if (!foundChild) {
                    foundChild = new PostmanDirectory(rootChildPath.lastValue, rootChildPath.value, []);
                    foundChild.addNodeRecursive(path, value, startDepth +1)
                    root.push(foundChild);
                } else {
                    foundChild.addNodeRecursive(path, value, startDepth +1);
                }

                return root;
            }, this._nodes);
    }

    private readonly extractPathVariables = (parameters: Parameters): Array<PostmanPathVariable> => {
        const pathVariables = parameters.getValues(InType.PATH);
        if (pathVariables.length === 0) {
            return [];
        }

        return PostmanPathVariable.ofParameters(pathVariables);
    }

    private readonly extractRequestBody = (specification: ApiSpecification): PostmanBodyWrapper | undefined => {
        //form data 의 경우
        if (specification.hasParameters) {
            const parameters = specification.parameters!;
            const queryParameters = parameters.getValues(InType.QUERY);

            //Query String
            if (specification.requestBody instanceof EmptyBody) {
                return undefined;
            }

            const formdata = this.toPostmanFormData(queryParameters);
            formdata.concat(this._configures.getDefaultParameters(specification.path))

            return PostmanBodyWrapper.fromFormData(formdata);
        }


        //Request Body 또는 비어있는 경우
        if (specification.requestBody instanceof EmptyBody) {
            return undefined;
        } else {
            const rawBody = this.toPostmanRawBody(specification.requestBody.fields);
            const wrappedBody = this._configures.wrappingBody(specification.path, rawBody);

            return PostmanBodyWrapper.fromRaw(wrappedBody);
        }
    }

    private readonly toPostmanFormData = (queryParameters: Array<Parameter>): Array<PostmanFormdata> => {
        return queryParameters.map(parameter => {
            const parameterKey = CaseMode.to(parameter.name, this._configures.casingMode);
            const value = this._configures.valuePlaceholder.has(parameterKey)
                ? `{{${this._configures.valuePlaceholder.get(parameterKey)}}}`
                : DefaultValue.fromTypeFormat(parameter.type, parameter.format).value;

            return new PostmanFormdata(parameterKey, value, "text", parameter.description)
        });
    }

    private readonly toPostmanRawBody = (fields: Array<IField>): IPostmanRequestBody => {
        return fields.reduce((body, field) => {
            const casedKey = CaseMode.to(field.name, this._configures.casingMode);
            body[casedKey] = this.extractFieldValueRecursive(field);
            return body;
        }, {} as { [key: string]: IPostmanRequestBody });
    }

    private readonly extractFieldValueRecursive = (field: IField): IPostmanRequestBody => {
        if (field.type.isObject()) {
            const objectField = field as ObjectField
            const body: { [key: string]: IPostmanRequestBody } = {};
            objectField.fields?.forEach(field => body[CaseMode.to(field.name, this._configures.casingMode)] = this.extractFieldValueRecursive(field));
            return body;
        }

        const valueField = field as ValueField;
        const fieldName = CaseMode.to(valueField.name, this._configures.casingMode);
        if (this._configures.valuePlaceholder.has(fieldName)) {
            const placeholder = this._configures.valuePlaceholder.get(fieldName);
            return `{{${placeholder}}}`;
        }

        return DefaultValue.fromTypeFormat(valueField.type, valueField.format).typeValue;
    }

    private readonly getDirectoryName = (path: Path): string => {
        return this._tagMap.has(path.value)
            ? this._tagMap.get(path.value)?.description ?? 'no-description'
            : path.indexOf(path.array.length - 1);
    }

    private readonly excludePathFilter = (spec: ApiSpecification): boolean => {
        const path = spec.path;
        return !this._configures.excludePaths.some(excludePath => excludePath.matches(path));
    }
}
