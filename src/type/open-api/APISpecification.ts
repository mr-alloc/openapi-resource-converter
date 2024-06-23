import HttpMethod from "@/type/open-api/constant/HttpMethod";
import IParsable from "@/type/open-api/protocol/IParsable";
import Path from "@/type/Path";

export default class APISpecification {

    private readonly _method: HttpMethod;
    private readonly _path: Path;
    private readonly _summary: string;
    private readonly _bodies: Array<IParsable>;

    constructor(methods: HttpMethod, path: string, summary: string, bodies: Array<IParsable>) {
        this._method = methods;
        this._path = new Path(path);
        this._summary = summary;
        this._bodies = bodies;
    }

    get method(): HttpMethod {
        return this._method;
    }

    get path(): Path {
        return this._path;
    }

    get summary(): string {
        return this._summary;
    }

    get bodies(): Array<IParsable> {
        return this._bodies;
    }

    public toString(): string {
        return `${this._method.value.toUpperCase()} ${this._path.value}\n${this._bodies.map(body => body.toString())}`
    }
}