import PostmanHeader from "@/type/postman/postman-header";
import IPostmanRequestBody from "@/type/postman/i-postman-request-body";
import CaseMode from "@/type/postman/constant/case-mode";
import Path from "@/type/path";
import TypeValue from "@/type/postman/type-value";
import ParsedPostmanOption from "@/type/postman/parsed-postman-option";
import PostmanRequestWrapperTemplate from "@/type/postman/postman-request-wrapper-template";
import RequestMode from "@/type/postman/constant/request-mode";
import PostmanFormdata from "@/type/postman/postman-formdata";
import {PostmanEventScript} from "@/type/postman/constant/postman-event-script";

export default class PostmanConvertConfigures {

    private _excludePaths: Array<Path>;
    private _host: string;
    private _headers: Array<PostmanHeader>;
    private _casingMode: CaseMode;
    private _defaultRequestWrappers: Array<PostmanRequestWrapperTemplate>;
    private _valuePlaceholder: Map<string, TypeValue>;

    public constructor() {
        this._excludePaths = [];
        this._host = '{{url}}';
        this._headers = [];
        this._casingMode = CaseMode.CAMEL;
        this._defaultRequestWrappers = [];
        this._valuePlaceholder = new Map<string, TypeValue>();
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

    public wrappingBody(path: Path, body: IPostmanRequestBody): IPostmanRequestBody {
        const found = this._defaultRequestWrappers.find(template =>
            template.type.equalsValue(RequestMode.RAW) && template.path.matches(path));

        if (found) {
            return found.format(body);
        }
        return body as IPostmanRequestBody;
    }

    public getDefaultParameters(path: Path): Array<PostmanFormdata> {
        const found = this._defaultRequestWrappers.find(template =>
            template.type.equalsValue(RequestMode.FORMDATA) && template.path.matches(path));
        if (found) {
            return found.values;
        }
        return [];
    }

    public getDefaultEvent(path: Path): Array<PostmanEventScript> {
        const found = this._defaultRequestWrappers.filter(template =>
            template.path.matches(path));
        return found
            .filter(matched => matched.event !== undefined)
            .map(matched => matched.event!);
    }


    public applyPostmanOption(parsedPostmanOption: ParsedPostmanOption) {
        this._host = parsedPostmanOption.host;
        this._excludePaths = parsedPostmanOption.excludePath;
        this._headers = parsedPostmanOption.headers;
        this._casingMode = parsedPostmanOption.caseMode;
        this._valuePlaceholder = parsedPostmanOption.placeholders;
        this._defaultRequestWrappers = parsedPostmanOption.templates;
    }
}
