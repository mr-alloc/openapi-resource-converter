import { toMap } from "@/util/collection-util";

export default class ProtocolType {

    static readonly NONE = new ProtocolType("none");
    static readonly SUMMARY = new ProtocolType("summary");
    static readonly REQUEST_BODY = new ProtocolType("requestBody");
    static readonly PARAMETERS = new ProtocolType("parameters");
    static readonly URL_ENCODED = new ProtocolType("urlencoded");
    static readonly TAGS = new ProtocolType("tags");

    private static readonly CACHED = toMap(ProtocolType.values(), (type) => type.value)
    private readonly _value: string;
    private constructor(value: string) {
        this._value = value;
    }

    get value(): string {
        return this._value;
    }

    public static values() {
        return [ProtocolType.REQUEST_BODY, ProtocolType.PARAMETERS, ProtocolType.URL_ENCODED];
    }

    public static fromValue(value: string): ProtocolType | undefined {
        return ProtocolType.CACHED.get(value);
    }

    public static hasValue(value: string): boolean {
        return ProtocolType.CACHED.has(value);
    }

    public static isProtocolFormat(name: string) {
        return this.values().some((type) => type.value === name);
    }

    public toString(): string {
        return this._value;
    }
}