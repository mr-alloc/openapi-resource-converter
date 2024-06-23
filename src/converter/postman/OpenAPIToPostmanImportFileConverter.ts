import IOpenAPIConverter from "@/converter/IOpenAPIConverter";
import PostmanImportFile from "@/type/postman/PostmanImportFile";
import OpenAPISpecification from "@/type/open-api/OpenAPISpecification";
import APISpecification from "@/type/open-api/APISpecification";
import CollectionUtil from "@/util/CollectionUtil";
import PostmanInfo from "@/type/postman/PostmanInfo";
import crypto from "crypto";
import IPostmanNode from "@/type/postman/IPostmanNode";
import PostmanConvertConfigures from "@/converter/postman/PostmanConvertConfigures";
import Path from "@/type/Path";
import PostmanDirectory from "@/type/postman/PostmanDirectory";
import PostmanRequest from "@/type/postman/PostmanRequest";
import PostmanUrl from "@/type/postman/PostmanUrl";
import PostmanRequestWrapper from "@/type/postman/PostmanRequestWrapper";
import IParsable from "@/type/open-api/protocol/IParsable";
import RequestBody from "@/type/open-api/protocol/RequestBody";
import PostmanBodyWrapper from "@/type/postman/PostmanBodyWrapper";
import Formdata from "@/type/open-api/protocol/Formdata";
import PostmanFormData from "@/type/postman/PostmanFormData";
import Tag from "@/type/open-api/sub/Tag";
import EmptyBody from "@/type/open-api/protocol/EmptyBody";
import IPostmanRequestBody from "@/type/postman/IPostmanRequestBody";
import Field from "@/type/open-api/sub/Field";
import ObjectField from "@/type/open-api/sub/ObjectField";
import DefaultValue from "@/type/postman/constant/DefaultValue";
import DefaultField from "@/type/postman/constant/DefaultValue";
import ValueField from "@/type/open-api/sub/ValueField";
import CaseMode from "@/type/postman/constant/CaseMode";
import Parameter from "@/type/open-api/sub/Parameter";
import HttpMethod from "@/type/open-api/constant/HttpMethod";

export default class OpenAPIToPostmanImportFileConverter implements IOpenAPIConverter<PostmanImportFile> {

    private readonly _openAPI: OpenAPISpecification;
    private readonly _group: Map<string, Map<string, APISpecification>>;
    private readonly _info: PostmanInfo;
    private readonly _nodes: Array<IPostmanNode>;
    private readonly _configures: PostmanConvertConfigures;
    private readonly _tagMap: Map<string, Tag>;

    constructor(openAPI: OpenAPISpecification, configures: PostmanConvertConfigures) {
        this._openAPI = openAPI;
        this._group = CollectionUtil.groupingAndThen(
            openAPI.specs,
            (spec) => spec.path.value,
            (values) => CollectionUtil.toMap(values, (spec) => spec.method.value.toUpperCase())
        );
        this._info = new PostmanInfo(crypto.randomUUID(), openAPI.info.title, 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json', '23012590');
        this._nodes = [];
        this._configures = configures;
        this._tagMap = CollectionUtil.toMap(openAPI.tags, tag => {
            // extract end point from description
            const extractedTag = /\/[a-zA-Z_{}\/]+/g.exec(tag.description);
            if (extractedTag) {
                return extractedTag[0];
            }

            return tag.description;
        });
    }

    convert(): PostmanImportFile {
        this._openAPI.specs.filter(this.excludePathFilter).forEach(this.exploreNode);
        return new PostmanImportFile(this._info, this._nodes)
    }

    private readonly exploreNode = (spec: APISpecification) => {
        this.exploreNodeInternal(this._nodes, spec.method, spec.path, 0);
    }

    private readonly exploreNodeInternal = (branches: Array<IPostmanNode>, method: HttpMethod, path: Path, index: number) => {
        if (path.array.length < index) {
            return;
        }

        const currentCursor = path.subset(index);
        const isDirectory = !this._group.has(currentCursor.value) || !this._group.get(currentCursor.value)?.has(method.value.toUpperCase());
        // isNewNode는 다음의 기준으로 결정된다.
        const isNewNode = isDirectory
            //1. 디렉토리 노드인경우 branch들중 PostmanDirectory가 없어야 한다.
            ? !branches.some(node => node.path === currentCursor.value && node instanceof PostmanDirectory)
            //2. 요청 노드인경우 해당 경로에 한개만 있어야하며, PostmanRequestWrapper여야 한다.
            : branches.filter(node => node.path === currentCursor.value && node instanceof PostmanRequestWrapper).length === 0

        if (isNewNode) {
            this.handleNewNode(branches, method, path, index, currentCursor, isDirectory);
            return;
        }

        if (isDirectory && path.array.length !== index) {
            const directory = branches.find(node => node.path === currentCursor.value && node instanceof PostmanDirectory) as PostmanDirectory;
            this.exploreNodeInternal(directory.item, method, path, index + 1);
        }
    }

    private readonly handleNewNode = (branches: Array<IPostmanNode>, method: HttpMethod, path: Path, index: number, currentCursor: Path, isDirectory: boolean) => {
        if (isDirectory) {
            const directory = new PostmanDirectory(this.getDirectoryName(currentCursor), currentCursor.value, []);
            branches.push(directory);
            this.exploreNodeInternal(directory.item, method, path, index + 1);
        } else {
            const methodMap = this._group.get(currentCursor.value);
            const request = methodMap?.get(method.value.toUpperCase());

            if (request) {
                this.whenRequest(request).forEach(request => branches.push(request));
            }
        }
    }

    private readonly whenRequest = (spec: APISpecification) => {
        //NOTE: PathVariable과 RequestBody를 동시에 사용하는경우 요청이 두개가 생기므로 이럴경우 PathVariable을 사용하는 요청을 필터링한다.
        const hasRequestBody = spec.bodies.some(body => body instanceof RequestBody);
        const hasFormData = spec.bodies.some(body => body instanceof Formdata);
        const needFilterPathVariableRequest = hasFormData && hasRequestBody && spec.bodies.find(body => body instanceof Formdata)?.needExtract();
        const parsableBodies = needFilterPathVariableRequest ? spec.bodies.filter(body => !(body instanceof Formdata)) : spec.bodies;

        return parsableBodies.map(body => this.extractBody(body, spec.path, spec.method)).map(body => {
            const request = new PostmanRequest(
                spec.method,
                this._configures.headers,
                body,
                PostmanUrl.of(this._configures.host, spec.path.value)
            );
            return new PostmanRequestWrapper(spec.summary, request)
        });
    }

    private readonly extractBody = (parsable: IParsable, path: Path, method: HttpMethod) => {
        if (parsable instanceof RequestBody) {
            const requestBody = parsable as RequestBody;
            const body = this.toPostmanRawBody(requestBody.fields);
            return PostmanBodyWrapper.fromRaw(this._configures.wrappingBody(path, method, body));
        } else if (parsable instanceof Formdata) {
            const formdata = parsable as Formdata;
            const data = formdata.parameters.map(this.toPostmanFormData);
            return PostmanBodyWrapper.fromFormData(data);
        } else if (parsable instanceof EmptyBody) {
            const defaultBody = this._configures.wrappingBody(path, method, {});
            return Array.isArray(defaultBody)
                ? PostmanBodyWrapper.fromFormData(defaultBody.map(this.toPostmanFormData))
                : PostmanBodyWrapper.fromRaw(defaultBody);
        }
        throw new Error("Not supported parsable type");
    }

    private readonly toPostmanFormData = (parameter: Parameter): PostmanFormData => {
        const parameterKey = CaseMode.to(parameter.name, this._configures.casingMode);
        const value = this._configures.valuePlaceholder.has(parameterKey)
            ? `{{${this._configures.valuePlaceholder.get(parameterKey)}}}`
            : DefaultField.fromTypeFormat(parameter.type, parameter.format).value;
        return new PostmanFormData(
            parameterKey,
            value,
            "text",
            parameter.description
        )
    }

    private readonly toPostmanRawBody = (fields: Array<Field>): IPostmanRequestBody => {
        return fields.reduce((body, field) => {
            const casedKey = CaseMode.to(field.name, this._configures.casingMode);
            body[casedKey] = this.toPostmanRawBodyRecursive(field);
            return body;
        }, {} as { [key: string]: IPostmanRequestBody });
    }

    private readonly toPostmanRawBodyRecursive = (field: Field): IPostmanRequestBody => {
        if (field.type.isObject()) {
            const objectField = field as ObjectField
            const body: { [key: string]: IPostmanRequestBody } = {};
            objectField.fields?.forEach(field => body[CaseMode.to(field.name, this._configures.casingMode)] = this.toPostmanRawBodyRecursive(field));
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

    private readonly excludePathFilter = (spec: APISpecification): boolean => {
        return !this._configures.excludePaths.includes(spec.path.value);
    }
}