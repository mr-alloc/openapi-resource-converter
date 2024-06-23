import CollectionUtil from "@/util/CollectionUtil";

export default class HttpMethod {

    static readonly GET = new HttpMethod("get");
    static readonly POST = new HttpMethod("post");
    static readonly PUT = new HttpMethod("put");
    static readonly DELETE = new HttpMethod("delete");
    static readonly PATCH = new HttpMethod("patch");
    static readonly HEAD = new HttpMethod("head");
    static readonly OPTIONS = new HttpMethod("options");

    private static readonly CACHED = CollectionUtil.toMap(HttpMethod.values(), (method) => method.value);

    private readonly _value: string;
    private constructor(value: string) {
        this._value = value;
    }

    get value(): string {
        return this._value;
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
}