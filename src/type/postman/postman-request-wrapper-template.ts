import Path from "@/type/path";
import RequestMode from "@/type/postman/constant/RequestMode";
import Parameter from "@/type/open-api/sub/parameter";
import IPostmanRequestBody from "@/type/postman/i-postman-request-body";

export default class PostmanRequestWrapperTemplate {

    private readonly _path: Path;
    private readonly _type: RequestMode;
    private readonly _format?: (str: IPostmanRequestBody) => IPostmanRequestBody;
    private readonly _values?: Array<Parameter>;

    private constructor(path: Path, type: RequestMode, format?: (body: IPostmanRequestBody) => IPostmanRequestBody, values?: Array<Parameter>) {
        this._path = path
        this._type = type
        this._format = format
        this._values = values
    }


    get path(): Path {
        return this._path;
    }

    get type(): RequestMode {
        return this._type;
    }


    public format(body: IPostmanRequestBody): IPostmanRequestBody {
        return this._format ? this._format(body) : body;
    }

    get values(): Array<Parameter> {
        return this._values ?? [];
    }

    public static ofConfig(path: Path, type: RequestMode, format?: (body: IPostmanRequestBody) => IPostmanRequestBody, values?: Array<Parameter>) {
        return new PostmanRequestWrapperTemplate(path, type, format, values)
    }
}