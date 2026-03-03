import {toMap} from "@/util/collection-util";

export default class HttpMethod {
    static readonly ALL = new HttpMethod("all");
    static readonly GET = new HttpMethod("get");
    static readonly POST = new HttpMethod("post");
    static readonly PUT = new HttpMethod("put");
    static readonly DELETE = new HttpMethod("delete");
    static readonly PATCH = new HttpMethod("patch");
    static readonly HEAD = new HttpMethod("head");
    static readonly OPTIONS = new HttpMethod("options");

    private static readonly CACHED = toMap(HttpMethod.values(), (method) => method.value);

    private readonly _value: string;
    private constructor(value: string) {
        this._value = value;
    }

    get value(): string {
        return this._value;
    }

    get upperValue(): string {
        return this._value.toUpperCase();
    }

    static hasValue(value: string): boolean {
        return HttpMethod.CACHED.has(value);
    }

    static fromValue(value: string): HttpMethod {
        return HttpMethod.CACHED.get(value)!;
    }

    static values(): Array<HttpMethod> {
        return [HttpMethod.GET, HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE, HttpMethod.PATCH, HttpMethod.HEAD, HttpMethod.OPTIONS];
    }

    public toString(): string {
        return this._value;
    }

    public static of(value?: string) {
        if (!value) return HttpMethod.ALL;
        value = value.toLowerCase();
        if (!HttpMethod.hasValue(value))
            throw Error(`Invalid value "${value}"`);
        return HttpMethod.fromValue(value);
    }

    public isAll(): boolean {
        return this._value === HttpMethod.ALL._value;
    }

    public equalsValue(other: HttpMethod): boolean {
        return this._value === other._value;
    }
}
