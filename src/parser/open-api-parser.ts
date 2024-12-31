import {notExist, readFile} from "@/util/file-util";
import {toJson} from "@/util/string-util";
import Version from "@/type/open-api/sub/version";
import ProjectInformation from "@/type/open-api/project/project-information";
import Tag from "@/type/open-api/sub/tag";
import {applyOrDefault, Property, toProps} from "@/util/object-util";
import OpenApiRequest from "@/type/open-api/protocol/open-api-request";
import ApiSpecification from "@/type/open-api/api-specification";
import EmptyBody from "@/type/open-api/protocol/empty-body";
import OpenApiSpecification from "@/type/open-api/open-api-specification";
import ComponentParser from "@/parser/component-parser";
import IField from "@/type/open-api/sub/i-field";
import ProtocolType from "@/type/open-api/constant/protocol-type";
import RequestBody from "@/type/open-api/protocol/request-body";
import RequestBodyParser from "@/parser/request-body-parser";
import ParametersParser from "@/parser/parameters-parser";


export default class OpenApiParser {

    private readonly _version: Version;
    private readonly _info: ProjectInformation;
    private readonly _tags: Array<Tag>;
    private readonly _components: Map<string, Array<IField>>;
    private readonly _paths: Array<Property>;

    public constructor(filePath: string, encoding: BufferEncoding = 'utf-8') {
        if (notExist(filePath))
            throw new Error(`Not found file with path: ${filePath}`);
        const json = toJson(readFile(filePath, encoding));

        new Map

        this._version = Version.parse(json.openapi);
        this._info = ProjectInformation.parse(json.info);
        this._tags = Tag.parse(json.tags);
        this._components = new ComponentParser(json.components).parse();
        this._paths = toProps(json.paths);
    }

    public parse(): OpenApiSpecification {
        const requests = this.parseToRequests(this._paths);
        const specs = this.parseToSpecs(requests);

        return new OpenApiSpecification(this._version, this._info, this._tags, specs);
    }

    /*
    AS IS
    "paths": {
        "/zapi/common/pstk/verify_pstk": {
            "post": {}
        },
        "/zapi/buy/pmangcash_delay": {
            "post": {}
        },
        "/wtapi/club/correct": {
            "post": {}
        }
    }

    TO BE
    [
        {
            "path": "/zapi/common/pstk/verify_pstk",
            "method": HttpMethod.POST,
            "metadata": {}
        }
        ...
    ]
    */
    private parseToRequests(paths: Array<Property>): Array<OpenApiRequest> {
        const result = new Array<OpenApiRequest>();
        //각 API 경로별로
        for (const pathProperty of paths) {
            const methodProperties = toProps(pathProperty.value);

            //각 메소드 별로
            for (const methodProperty of methodProperties) {
                result.push(new OpenApiRequest(pathProperty.name, methodProperty));
            }
        }

        return result;
    }

    private parseToSpecs(requests: Array<OpenApiRequest>): Array<ApiSpecification> {
        const specs = new Array<ApiSpecification>();
        //각 요청별로
        for (const request of requests) {
            const requestBodyProperty = request.payloadOf(ProtocolType.REQUEST_BODY);
            const requestBody = applyOrDefault<Property, RequestBody | EmptyBody>(
                requestBodyProperty,
                new EmptyBody(),
                (property) => {
                    return RequestBodyParser.getInstance().parse(property, this._components);
                });

            const parametersProperty = request.payloadOf(ProtocolType.PARAMETERS);
            const parameters = ParametersParser.getInstance().parse(parametersProperty);

            //요청 파라미터 정보가 없어도, 빈 요청을 생성한다.
            specs.push(new ApiSpecification(request, requestBody, parameters));
        }

        return specs;
    }
}
