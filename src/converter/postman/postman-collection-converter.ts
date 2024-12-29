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
import Formdata from "@/type/open-api/protocol/formdata";
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
import HttpMethod from "@/type/open-api/constant/http-method";
import InType from "@/type/open-api/constant/in-type";
import PostmanHeader from "@/type/postman/postman-header";

export default class PostmanCollectionConverter implements IOpenapiConverter {

    private readonly _openAPI: OpenApiSpecification;
    private readonly _group: Map<string, Map<string, ApiSpecification>>;
    private readonly _info: PostmanInfo;
    private readonly _nodes: Array<IPostmanNode>;
    private readonly _configures: PostmanConvertConfigures;
    private readonly _tagMap: Map<string, Tag>;

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
    }

    public convert(): PostmanImportFile {
        const filtered = this._openAPI.specs.filter(this.excludePathFilter);

        for (const spec of filtered) {
            this.exploreNode(this._nodes, spec.method, spec.path, 0);
        }

        return new PostmanImportFile(this._info, this._nodes)
    }

    private notExistInGroup(path: Path, method: HttpMethod): boolean {
        if (!this._group.has(path.value)) {
            return true;
        }

        const methodMap = this._group.get(path.value)!;
        return !methodMap.has(method.upperValue);
    }

    private checkNewNode(branches: Array<IPostmanNode>, currentCursor: Path, isDirectory: boolean) {
        if (currentCursor.value.startsWith('/v1/mission')) {
            console.log(`[${currentCursor}] branches:`, branches.map(node => node.path.value));
        }
        return isDirectory
            //1. 디렉토리 노드인경우 branch 목록 중 PostmanDirectory 가 없어야 한다.
            ? !branches.some(node => node.path.value === currentCursor.value && node instanceof PostmanDirectory)
            //2. 요청 노드인경우 해당 경로에 한개만 있어야하며, PostmanRequestWrapper 이어야만 한다.
            : branches.filter(node => node.path.value === currentCursor.value && node instanceof PostmanRequestWrapper).length === 0;
    }
    private readonly exploreNode = (branches: Array<IPostmanNode>, method: HttpMethod, path: Path, index: number) => {
        if (path.array.length == index) {
            return;
        }


        const currentCursor = path.subset(index);
        const isDirectory = this.notExistInGroup(currentCursor, method);
        const isNewNode = this.checkNewNode(branches, currentCursor, isDirectory);
        const existSameNameDirectory = !isDirectory && isNewNode && currentCursor.value === path.value && branches
            .filter(node => node instanceof PostmanDirectory)
            .some(node => node.path.value === currentCursor.value);

        if (path.value.startsWith('/v1/mission')) {
            console.log(`${path.value} - ${currentCursor.value}`)
            console.log(`{DIR: ${isDirectory}|NEW: ${isNewNode}|IDX: ${index}|EXS: ${existSameNameDirectory}}`, branches.map(node => node.path.value))
            console.log('--------------------------------------------------------------------')
        }

        //새로운 노드이면서, 디렉토리가 아니고, 같은 이름의 디렉토리가 있다면 그곳으로 들어간다.
        if (existSameNameDirectory) {
            const found = branches.filter(node => node instanceof PostmanDirectory)
                .find(node => node.path.value === currentCursor.value) as PostmanDirectory;

            if (path.value.startsWith('/v1/mission')) {
                console.log(`[${currentCursor.value}:${method}] found`, found);
            }

            if (found) {
                this.addRequest(found.item, currentCursor, method);
            }
        }
        //새로운 노드라서, 브랜치(디렉토리) 안으로 넣어야 하는경우
        if (isNewNode) {
            this.handleNewNode(branches, method, path, index, currentCursor, isDirectory);
            return;
        }

        //디렉토리면서, 아직 순회할 경로가 남아있다면.
        if (isDirectory && path.array.length > index) {
            const directory = branches.find(node => node.path.value === currentCursor.value && node instanceof PostmanDirectory) as PostmanDirectory;
            this.exploreNode(directory.item, method, path, index + 1);
        }
    }

    private readonly handleNewNode = (branches: Array<IPostmanNode>, method: HttpMethod, path: Path, index: number, currentCursor: Path, isDirectory: boolean) => {
        if (isDirectory) {
            const directory = new PostmanDirectory(this.getDirectoryName(currentCursor), currentCursor.value, []);
            branches.push(directory);
            this.exploreNode(directory.item, method, path, index + 1);
        } else {
            this.addRequest(branches, currentCursor, method);
        }
    }

    private readonly addRequest = (branches: Array<IPostmanNode>, currentCursor: Path, method: HttpMethod) => {
        const methodMap = this._group.get(currentCursor.value);
        const request = methodMap?.get(method.value.toUpperCase());

        if (currentCursor.value.startsWith('/v1/mission')) {
            console.log(`[${currentCursor.value}:${method}] request`, request);
        }

        //exist in request map
        if (request) {
            this.whenRequest(request).forEach(request => branches.push(request));
        }
    }

    private readonly whenRequest = (spec: ApiSpecification) => {
        //NOTE: PathVariable과 RequestBody를 동시에 사용하는경우 요청이 두개가 생기므로 이럴경우 PathVariable을 사용하는 요청을 필터링한다.
        const hasRequestBody = spec.bodies.some(body => body instanceof RequestBody);
        const hasFormData = spec.bodies.some(body => body instanceof Formdata);
        const needFilterPathVariableRequest = hasFormData && hasRequestBody && spec.bodies.find(body => body instanceof Formdata)?.needExtract();
        const parsableBodies = needFilterPathVariableRequest ? spec.bodies.filter(body => !(body instanceof Formdata)) : spec.bodies;

        return parsableBodies.map(body => this.extractBody(body, spec.path)).map(bodyWrapper => {
            const headers = this._configures.headers;
            headers.push(...bodyWrapper.headers);
            const request = new PostmanRequest(
                spec.method,
                headers,
                bodyWrapper,
                PostmanUrl.of(this._configures.host, spec.path.value)
            );
            return new PostmanRequestWrapper(spec.summary, request)
        });
    }

    private extractRequestBody(parsable: IParsable, path: Path) {
        const requestBody = parsable as RequestBody;
        const rawBody = this.toPostmanRawBody(requestBody.fields);

        const wrappedBody = this._configures.wrappingBody(path, rawBody);

        return PostmanBodyWrapper.fromRaw(wrappedBody);
    }

    private extractFormdata(parsable: IParsable, path: Path) {
        const formdata = parsable as Formdata;
        const parameters = formdata.parameters.concat(this._configures.getDefaultParameters(path));

        const data = parameters
            .filter(param => param.in.value !== InType.HEADER.value)
            .map(this.toPostmanFormData);
        const headers = parameters.filter(param => param.in.value === InType.HEADER.value);
        //TODO Header Accumulation
        const bodyWrapper = PostmanBodyWrapper.fromFormData(data);
        bodyWrapper.headers = headers.map(header => new PostmanHeader(
            header.name,
            DefaultValue.fromTypeFormat(header.type, header.format).value
        ))
        return bodyWrapper;
    }

    private extractEmptyBody(path: Path) {
        const defaultBody = this._configures.wrappingBody(path, {});
        return Array.isArray(defaultBody)
            ? PostmanBodyWrapper.fromFormData(defaultBody.map(this.toPostmanFormData))
            : PostmanBodyWrapper.fromRaw(defaultBody);
    }

    private readonly extractBody = (parsable: IParsable, path: Path) => {
        if (parsable instanceof RequestBody) {
            return this.extractRequestBody(parsable, path);
        } else if (parsable instanceof Formdata) {
            return this.extractFormdata(parsable, path);
        } else if (parsable instanceof EmptyBody) {
            return this.extractEmptyBody(path);
        }
        throw new Error("Not supported parsable type");
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
