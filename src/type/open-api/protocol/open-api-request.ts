import HttpMethod from "@/type/open-api/constant/http-method";
import {getProp, hasProp, Property} from "@/util/object-util";
import ProtocolType from "@/type/open-api/constant/protocol-type";

export default class OpenApiRequest {

    private readonly _path: string;
    private readonly _method: HttpMethod;
    private readonly _metadata: Property;

    public constructor(path: string, metadata: Property) {
        this._path = path;
        this._method = HttpMethod.fromValue(metadata.name);
        this._metadata = metadata;
    }

    get path(): string {
        return this._path;
    }

    get method(): HttpMethod {
        return this._method;
    }

    get metadata(): Property {
        return this._metadata;
    }

    public payloadOf(protocol: ProtocolType): Property | undefined {
        if (!hasProp(this._metadata.value, protocol.value)) {
            return undefined;
        }

        return new Property(protocol.value, getProp<any>(this._metadata.value, protocol.value));
    }
}
