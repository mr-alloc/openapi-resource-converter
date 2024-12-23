import HttpMethod from "@/type/open-api/constant/HttpMethod";
import {Property, toProps} from "@/util/ObjectUtil";
import ProtocolType from "@/type/open-api/constant/ProtocolType";
import Path from "@/type/Path";

export default class OpenApiRequest {

    private readonly _method: HttpMethod;
    private readonly _path: string;
    private readonly _metadata: Array<Property>;

    private constructor(method: string, path: string, metadata: Array<Property>) {
        this._method = HttpMethod.fromValue(method);
        this._path = path;
        this._metadata = metadata;
    }

    get method(): HttpMethod {
        return this._method;
    }

    get path(): string {
        return this._path;
    }

    get metadata(): Array<Property> {
        return this._metadata;
    }

    get summary(): string {
        const found = this._metadata.find((prop) => prop.name === ProtocolType.SUMMARY.value);
        return found?.value
            ?? Path.ofValue(this._path).lastValue();
    }

    get metadataProtocols(): Array<ProtocolType> {
        //meta는 summary, operationId, requestBody, parameters, responses로 구성
        return this._metadata.map((prop) => prop.name)
            .filter((name) => ProtocolType.hasValue(name))
            .map((name) => ProtocolType.fromValue(name)!);
    }

    public static parse(path: string, methodProperty: Property): OpenApiRequest {
        return new OpenApiRequest(
            methodProperty.name,
            path,
            toProps(methodProperty.value)
        );
    }

    public metadataOf(protocol: ProtocolType): Array<Property> {
        const found = this._metadata.find((prop) => prop.name === protocol.value);
        if (found) {
            return toProps(found.value) ?? [];
        }

        throw new Error(`Not found metadata with protocol: ${protocol.value}`);
    }
}