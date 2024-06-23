import ProtocolType from "@/type/open-api/constant/ProtocolType";

export default class RequestMode {

    static readonly NONE = new RequestMode(ProtocolType.NONE, "none");
    static readonly RAW = new RequestMode(ProtocolType.REQUEST_BODY, "raw");
    static readonly FORMDATA = new RequestMode(ProtocolType.PARAMETERS, "formdata");
    static readonly URL_ENCODED = new RequestMode(ProtocolType.URL_ENCODED, "urlencoded");

    private readonly _protocol: ProtocolType;
    private readonly _value: string;

    private constructor(protocol: ProtocolType, value: string) {
        this._protocol = protocol;
        this._value = value;
    }

    get value(): string {
        return this._value;
    }

    static fromProtocol(protocol: ProtocolType): RequestMode {
        return [RequestMode.RAW, RequestMode.FORMDATA, RequestMode.URL_ENCODED].find(mode => mode._protocol === protocol) ?? RequestMode.NONE;
    }
}