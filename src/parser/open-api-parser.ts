import fs from "fs";
import {notExist, readFile} from "@/util/file-util";
import {isJson, toJson} from "@/util/string-util";
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


export const parse = (filePath: string, encoding: BufferEncoding = 'utf-8') => {
    if (notExist(filePath))
        throw new Error(`Not found file with path: ${filePath}`);

    const file = readFile(filePath, encoding);
    const { version, info, tags, paths } = parseMetadata(toJson(file));

    const requests = parseToRequests(paths);
    const specs = parseToSpecs(requests);

    return new OpenAPISpecification(version, info, tags, specs);
}

const parseMetadata = (json: any) => {
    return {
        version: Version.parse(json.openapi),
        info: ProjectInformation.parse(json.info),
        tags: Tag.parse(json.tags),
        paths: toProps(json.paths),
        components: new ComponentParser(json.components).parse()
    }
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
const parseToRequests = (paths: Array<Property>): Array<OpenApiRequest> => {
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

const parseToSpecs = (requests: Array<OpenApiRequest>) => {
    const specs = new Array<APISpecification>();
    //각 요청별로
    for (const request of requests) {
        const summary = request.summary;
        const bodies = new Array<IParsable>();

        //요청내 요청값 별로 (request body, parameters, form data...)
        for (const protocol of request.metadataProtocols) {
            const metaDataValues = request.metadataOf(protocol);
            const adapter = ParserFactory.getInstance().getParser(protocol);
            if (! adapter) continue;

            //각 토큰 별로 (요청값 별로 토큰이 나눠져 있음으로 한번 더 반복이 필요없음
            const tokenPath = adapter.getTokenPath(protocol);
            if (checkPath(metaDataValues, tokenPath)) {
                bodies.push(adapter.parse(metaDataValues, tokenPath));
            }
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

