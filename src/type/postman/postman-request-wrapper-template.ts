import Path from "@/type/path";
import RequestMode from "@/type/postman/constant/request-mode";
import IPostmanRequestBody from "@/type/postman/i-postman-request-body";
import PostmanFormdata from "@/type/postman/postman-formdata";
import {PostmanEventScript} from "@/type/postman/constant/postman-event-script";
import PostmanHeader from "@/type/postman/postman-header";
import HttpMethod from "@/type/open-api/constant/http-method";

export default class PostmanRequestWrapperTemplate {

    private readonly _path: Path;
    private readonly _method: HttpMethod;
    private readonly _type: RequestMode;
    private readonly _format?: (str: IPostmanRequestBody) => IPostmanRequestBody;
    private readonly _values?: Array<PostmanFormdata>;

    private _event?: PostmanEventScript;
    private _headers?: Array<PostmanHeader>;

    private constructor(
        path: Path,
        method: HttpMethod,
        type: RequestMode,
        format?: (body: IPostmanRequestBody) => IPostmanRequestBody,
        values?: Array<PostmanFormdata>
    ) {
        this._path = path
        this._method = method;
        this._type = type
        this._format = format
        this._values = values
    }

    public isMatchedHandler(path: Path, method: HttpMethod): boolean {
        return this._path.matches(path) && (this._method.isAll() || this._method.equalsValue(method));
    }


    get path(): Path {
        return this._path;
    }

    get method(): HttpMethod {
        return this._method;
    }

    get type(): RequestMode {
        return this._type;
    }

    public format(body: IPostmanRequestBody): IPostmanRequestBody {
        return this._format ? this._format(body) : body;
    }

    get values(): Array<PostmanFormdata> {
        return this._values ?? [];
    }

    get event(): PostmanEventScript | undefined {
        return this._event;
    }

    set event(event: PostmanEventScript) {
        this._event = event;
    }

    get headers(): Array<PostmanHeader> | undefined {
        return this._headers;
    }

    set headers(headers: Array<PostmanHeader>) {
        this._headers = headers;
    }

    public static ofConfig(
        path: Path,
        method: HttpMethod,
        type: RequestMode,
        format?: (body: IPostmanRequestBody) => IPostmanRequestBody,
        values?: Array<PostmanFormdata>
    ) {
        return new PostmanRequestWrapperTemplate(path, method, type, format, values)
    }

    public allowMode(mode: RequestMode): boolean {
        return this._type.isAll() || this._type.equalsValue(mode);
    }
}
