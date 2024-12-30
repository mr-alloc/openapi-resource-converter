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
import PostmanRequestWrapper from "@/type/postman/postman-request-wrapper";
import IParsable from "@/type/open-api/protocol/i-parsable";
import RequestBody from "@/type/open-api/protocol/request-body";
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
import PostmanHeader from "@/type/postman/postman-header";

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
            const request = methodMap?.get(method.value.toUpperCase())!;
            const existDirectory = this._directoryMap.has(path.value);

            //디렉토리가 이미 생성된 경우
            if (existDirectory) {
                const directory = this._directoryMap.get(path.value)!;
                this.whenRequest(request).forEach(request => directory.item.push(request));
            } else {
                const directory = new PostmanDirectory(this.getDirectoryName(path), path.value, []);
                this.whenRequest(request).forEach(request => directory.item.push(request))
                this._directoryMap.set(path.value, directory);
            }
        }

        return new PostmanImportFile(this._info, this.compactDirectories())
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
                    root.push(foundChild);
                } else {
                    foundChild.addNodeRecursive(path, value, startDepth +1);
                }

                return root;
            }, this._nodes);
    }

    private readonly whenRequest = (spec: ApiSpecification) => {
        //NOTE: PathVariable과 RequestBody를 동시에 사용하는경우 요청이 두개가 생기므로 이럴경우 PathVariable을 사용하는 요청을 필터링한다.
        const hasRequestBody = spec.bodies.some(body => body instanceof RequestBody);
        const hasFormData = spec.bodies.some(body => body instanceof Parameters);
        const needFilterPathVariableRequest = hasFormData && hasRequestBody && spec.bodies.find(body => body instanceof Parameters)?.needExtract();
        const parsableBodies = needFilterPathVariableRequest
            ? spec.bodies.filter(body => !(body instanceof Parameters))
            : spec.bodies;

        //TODO Path Variable 처리 필요.
        return parsableBodies.map(body => this.extractBody(body, spec.path))
            .map(bodyWrapper => {
                const headers = this._configures.headers;
                headers.push(...bodyWrapper.headers);
                const request = new PostmanRequest(
                    spec.method,
                    headers,
                    PostmanUrl.of(this._configures.host, spec.path.value),
                    bodyWrapper
                );
                return new PostmanRequestWrapper(spec.summary, request)
            });
    }

    private readonly extractBody = (parsable: IParsable, path: Path) => {
        if (parsable instanceof RequestBody) {
            return this.extractRequestBody(parsable, path);
        } else if (parsable instanceof Parameters) {
            return this.extractParameters(parsable, path);
        } else if (parsable instanceof EmptyBody) {
            return this.extractEmptyBody(path);
        }
        throw new Error("Not supported parsable type");
    }

    private extractRequestBody(parsable: IParsable, path: Path) {
        const requestBody = parsable as RequestBody;
        const rawBody = this.toPostmanRawBody(requestBody.fields);

        const wrappedBody = this._configures.wrappingBody(path, rawBody);

        return PostmanBodyWrapper.fromRaw(wrappedBody);
    }

    private extractParameters(parsable: IParsable, path: Path) {
        const parameters = parsable as Parameters;
        const headers = PostmanHeader.ofParameters(parameters.getValues(InType.HEADER))
            .concat(this._configures.headers);
        const queryParameters = parameters.getValues(InType.QUERY)
            .concat(this._configures.getDefaultParameters(path));

        const data = queryParameters.map(this.toPostmanFormData);

        //TODO Header Accumulation
        const bodyWrapper = PostmanBodyWrapper.fromFormData(data);
        bodyWrapper.headers = headers
        bodyWrapper.url
        return bodyWrapper;
    }

    private extractEmptyBody(path: Path) {
        const defaultBody = this._configures.wrappingBody(path, {});
        return Array.isArray(defaultBody)
            ? PostmanBodyWrapper.fromFormData(defaultBody.map(this.toPostmanFormData))
            : PostmanBodyWrapper.fromRaw(defaultBody);
    }

    private readonly toPostmanFormData = (parameter: Parameter): PostmanFormdata => {
        const parameterKey = CaseMode.to(parameter.name, this._configures.casingMode);
        const value = this._configures.valuePlaceholder.has(parameterKey)
            ? `{{${this._configures.valuePlaceholder.get(parameterKey)}}}`
            : DefaultValue.fromTypeFormat(parameter.type, parameter.format).value;
        return new PostmanFormdata(
            parameterKey,
            value,
            "text",
            parameter.description
        )
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
