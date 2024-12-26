import {notExist, readFile} from "@/util/file-util";
import {toJson} from "@/util/string-util";
import Version from "@/type/open-api/sub/Version";
import ProjectInformation from "@/type/open-api/project/project-information";
import Tag from "@/type/open-api/sub/Tag";
import {checkPath, Property, toProps} from "@/util/object-util";
import OpenApiRequest from "@/type/open-api/protocol/open-api-request";
import IParsable from "@/type/open-api/protocol/i-parsable";
import APISpecification from "@/type/open-api/APISpecification";
import ParserFactory from "@/parser/parser-factory";
import EmptyBody from "@/type/open-api/protocol/empty-body";
import OpenAPISpecification from "@/type/open-api/OpenAPISpecification";
import ComponentParser from "@/parser/component-parser";
import IField from "@/type/open-api/sub/i-field";



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

    public parse(): OpenAPISpecification {
        const requests = this.parseToRequests(this._paths);
        const specs = this.parseToSpecs(requests);

        return new OpenAPISpecification(this._version, this._info, this._tags, specs);
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
                result.push(OpenApiRequest.parse(pathProperty.name, methodProperty));
            }
        }

        return result;
    }

    private parseToSpecs(requests: Array<OpenApiRequest>): Array<APISpecification> {
        const specs = new Array<APISpecification>();
        //각 요청별로
        for (const request of requests) {
            const summary = request.summary;
            const bodies = new Array<IParsable>();

            //요청내 요청값 별로 (request body, parameters, form data...)
            for (const protocol of request.metadataProtocols) {
                const metadata = request.metadataOf(protocol);
                const parser = ParserFactory.getInstance().getParser(protocol);
                if (! parser) continue;

                //각 토큰 별로 (요청값 별로 토큰이 나눠져 있음으로 한번 더 반복이 필요없음
                const parsable = parser.parse(metadata, protocol, this._components);
                bodies.push(parsable);
            }

            //요청 파라미터 정보가 없어도, 빈 요청을 생성한다.
            specs.push(new APISpecification(
                request.method,
                request.path,
                summary,
                (bodies.length === 0 ? [new EmptyBody()] : bodies)
            ));

        }

        return specs;
    }
}
