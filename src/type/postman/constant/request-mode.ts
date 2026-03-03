import ProtocolType from "@/type/open-api/constant/protocol-type";

export default class RequestMode {

    static readonly ALL = new RequestMode(ProtocolType.NONE, "all");
    static readonly RAW = new RequestMode(ProtocolType.REQUEST_BODY, "raw");
    static readonly FORM_DATA = new RequestMode(ProtocolType.PARAMETERS, "formdata");
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

    public static fromValue(value: string | undefined): RequestMode {
        if (!value) return RequestMode.ALL;
        return [this.ALL, this.RAW, this.FORM_DATA, this.URL_ENCODED]
            .find(mode => mode.value === value) ?? RequestMode.ALL;
    }

    public equalsValue(other: RequestMode) {
        return this._value === other._value;
    }

    public isAll() {
        return this._value === RequestMode.ALL._value;
    }
}