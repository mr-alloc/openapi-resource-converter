import CaseMode from "@/type/postman/constant/CaseMode";
import PostmanHeader from "@/type/postman/postman-header";
import TypeValue from "@/type/postman/type-value";
import Path from "@/type/path";

export default class ParsedPostmanOption {

    private readonly _host: string;
    private readonly _excludePath: Array<Path>;
    private readonly _headers: Array<PostmanHeader>;
    private readonly _caseMode: CaseMode;
    private readonly _placeholders: Map<string, TypeValue>;

    public constructor(host: string, excludePath: Array<Path>, headers: Array<PostmanHeader>, caseMode: CaseMode, placeholders: Map<string, TypeValue>) {
        this._host = host;
        this._excludePath = excludePath;
        this._headers = headers;
        this._caseMode = caseMode;
        this._placeholders = placeholders;
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

    public static ofDefault(): ParsedPostmanOption {
        return new ParsedPostmanOption('localhost', [], [], CaseMode.SNAKE, new Map<string, TypeValue>());
    }
}