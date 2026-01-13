import CaseMode from "@/type/postman/constant/case-mode";
import PostmanHeader from "@/type/postman/postman-header";
import TypeValue from "@/type/postman/type-value";
import Path from "@/type/path";
import PostmanRequestWrapperTemplate from "@/type/postman/postman-request-wrapper-template";

export default class ParsedPostmanOption {

    private readonly _host: string;
    private readonly _excludePath: Array<Path>;
    private readonly _headers: Array<PostmanHeader>;
    private readonly _caseMode: CaseMode;
    private readonly _placeholders: Map<string, TypeValue>;
    private readonly _templates: Array<PostmanRequestWrapperTemplate>;

    public constructor(
        host: string,
        excludePath: Array<Path>,
        headers: Array<PostmanHeader>,
        caseMode: CaseMode,
        placeholders: Map<string, TypeValue>,
        templates: Array<PostmanRequestWrapperTemplate>
    ) {
        this._host = host;
        this._excludePath = excludePath;
        this._headers = headers;
        this._caseMode = caseMode;
        this._placeholders = placeholders;
        this._templates = templates;
    }


    get host(): string {
        return this._host;
    }

    get excludePath(): Array<Path> {
        return this._excludePath;
    }

    get headers(): Array<PostmanHeader> {
        return this._headers;
    }

    get caseMode(): CaseMode {
        return this._caseMode;
    }

    get placeholders(): Map<string, TypeValue> {
        return this._placeholders;
    }

    get templates(): Array<PostmanRequestWrapperTemplate> {
        return this._templates;
    }

    public static ofDefault(): ParsedPostmanOption {
        return new ParsedPostmanOption('{{url}}', [], [], CaseMode.SNAKE, new Map<string, TypeValue>(), []);
    }

    public printStatus() {
        //pretty print
        console.log('Host:', this._host);
        console.log('Exclude path:', this._excludePath);
        console.log('Headers:', this._headers);
        console.log('Case mode:', this._caseMode.value);
        console.log('Placeholders:', [...this._placeholders.entries()].map(([key, value]) => `${key}: ${value}`));
    }
}
