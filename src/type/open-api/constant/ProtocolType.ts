import CollectionUtil from "@/util/CollectionUtil";

export default class ProtocolType {

    static readonly NONE = new ProtocolType("none");
    static readonly SUMMARY = new ProtocolType("summary");
    static readonly REQUEST_BODY = new ProtocolType("requestBody");
    static readonly PARAMETERS = new ProtocolType("parameters");
    static readonly URL_ENCODED = new ProtocolType("urlencoded");
    static readonly TAGS = new ProtocolType("tags");

    private static readonly CACHED = CollectionUtil.toMap(ProtocolType.values(), (type) => type.value)
    private readonly _value: string;
    private constructor(value: string) {
        this._value = value;
    }

    get value(): string {
        return this._value;
    }

    static values() {
        return [ProtocolType.REQUEST_BODY, ProtocolType.PARAMETERS, ProtocolType.URL_ENCODED];
    }

    static fromValue(value: string): ProtocolType | undefined {
        return ProtocolType.CACHED.get(value);
    }

    static hasValue(value: string): boolean {
        return ProtocolType.CACHED.has(value);
    }
}