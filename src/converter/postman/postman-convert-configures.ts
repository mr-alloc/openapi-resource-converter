import PostmanHeader from "@/type/postman/postman-header";
import IPostmanRequestBody from "@/type/postman/i-postman-request-body";
import CaseMode from "@/type/postman/constant/CaseMode";
import Path from "@/type/path";
import HttpMethod from "@/type/open-api/constant/http-method";
import Parameter from "@/type/open-api/sub/Parameter";
import TypeValue from "@/type/postman/type-value";
import ParsedPostmanOption from "@/type/postman/parsed-postman-option";

export default class PostmanConvertConfigures {

    private _excludePaths: Array<Path>;
    private _host: string;
    private _headers: Array<PostmanHeader>;
    private _casingMode: CaseMode;
    private _defaultBodyWrapper: ((path: Path, method: HttpMethod, body: IPostmanRequestBody) => IPostmanRequestBody) | undefined;
    private _valuePlaceholder = new Map<string, TypeValue>;

    constructor() {
        this._excludePaths = [];
        this._host = 'localhost';
        this._headers = [];
        this._casingMode = CaseMode.CAMEL;
    }

    get excludePaths(): Array<Path> {
        return this._excludePaths;
    }

    get host(): string {
        return this._host;
    }

    get headers(): Array<PostmanHeader> {
        return this._headers;
    }

    get casingMode(): CaseMode {
        return this._casingMode;
    }

    get valuePlaceholder(): Map<string, any> {
        return this._valuePlaceholder;
    }

    defaultBodyWrapper(value: (path: Path, method: HttpMethod, body: IPostmanRequestBody) => IPostmanRequestBody | Array<Parameter>) {
        this._defaultBodyWrapper = value;
        return this;
    }

    addPlaceholders(placeholders: Map<string, any>) {
        placeholders.forEach((value, key) => {
            this._valuePlaceholder.set(CaseMode.to(key, this.casingMode), value);
        });
        return this;
    }

    addExcludePaths(paths: Array<Path>) {
        this._excludePaths = paths;
        return this;
    }

    addHeaders(headers: Array<PostmanHeader>) {
        this._headers = headers;
        return this;

    }

    wrappingBody(path: Path, method: HttpMethod, body: IPostmanRequestBody): IPostmanRequestBody {
        if (this._defaultBodyWrapper) {
            return this._defaultBodyWrapper(path, method, body);
        }
        return body as IPostmanRequestBody;
    }

    public applyPostmanOption(parsedPostmanOption: ParsedPostmanOption) {
        this._host = parsedPostmanOption.host;
        this._excludePaths = parsedPostmanOption.excludePath;
        this._headers = parsedPostmanOption.headers;
        this._casingMode = parsedPostmanOption.caseMode;
        this._valuePlaceholder = parsedPostmanOption.placeholders;
    }
}