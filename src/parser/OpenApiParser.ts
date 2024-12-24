import OpenAPISpecification from "@/type/open-api/OpenAPISpecification";
import fs from 'fs';
import ProjectInformation from "@/type/open-api/project/project-information";
import Tag from "@/type/open-api/sub/Tag";
import ParserFactory from "@/parser/parser-factory";
import ProtocolType from "@/type/open-api/constant/protocol-type";
import APISpecification from "@/type/open-api/APISpecification";
import HttpMethod from "@/type/open-api/constant/HttpMethod";
import Version from "@/type/open-api/sub/Version";
import EmptyBody from "@/type/open-api/protocol/empty-body";
import ComponentParser from "@/parser/component-parser";
import {toProps} from "@/util/object-util";
import Path from "@/type/Path";


function parse(filePath: string): OpenAPISpecification {
    if ( ! fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    const openApiJson = fs.readFileSync(filePath, 'utf-8');
    return parseInternal(JSON.parse(openApiJson));
}


function parseInternal(openApiJson: any) {
    const version = Version.parse(openApiJson.openapi);
    const info = ProjectInformation.fromJson(openApiJson.info);
    const tags = openApiJson.tags?.map((tag: any) => Tag.fromJson(tag)) ?? [];
    const adapterFactory = ParserFactory.getInstance();
    const components = ComponentParser.getInstance().parse(openApiJson);

    const apiSpecifications = toProps(openApiJson.paths)
        .flatMap(pathProperty => toProps(pathProperty.value!)
            .map(methodProperty => [
                pathProperty.name,
                HttpMethod.fromValue(methodProperty.name),
                methodProperty.value
            ])
        )
        .map(([path, method, meta]) => {
            //meta는 summary, operationId, requestBody, parameters, responses로 구성
            const summary = meta[ProtocolType.SUMMARY.value] ?? Path.ofValue(path).lastValue();
            const protocols = Object.keys(meta)
                .filter(protocol => ProtocolType.hasValue(protocol) && meta[protocol] !== undefined)
                .flatMap(key => {
                    const protocolType = ProtocolType.fromValue(key)!;
                    const adapter = adapterFactory.getAppropriateAdapter(protocolType);
                    if ( ! adapter) return [];
                    const tokenPaths = adapter.getTokenPath();
                    return tokenPaths
                        ?.filter(tokenPath => adapter.checkPath(meta[key], tokenPath))
                        ?.map(tokenPath => adapter.parse(meta[key], tokenPath, components));
                });
            //요청정보가 없는경우
            if (protocols.length === 0) {
                return new APISpecification(method, path, summary, [new EmptyBody()])
            }

            return new APISpecification(method, path, summary, protocols)
        });
    return new OpenAPISpecification(version, info, tags, apiSpecifications);
}

export default {
    parse
}