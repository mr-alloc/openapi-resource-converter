import IParsable from "@/type/open-api/protocol/i-parsable";
import IField from "@/type/open-api/sub/i-field";
import ProtocolType from "@/type/open-api/constant/protocol-type";

export default class RequestBody implements IParsable {

    private static readonly TOKEN_PATH_CONTENT_JSON_SCHEMA_PROPERTIES = "content.application/json.schema.properties";
    private static readonly TOKEN_PATH_CONTENT_FORM_SCHEMA_PROPERTIES = "content.application/x-www-form-urlencoded.schema.properties";

    private static readonly TOKEN_PATH_MAP = new Map<ProtocolType, string>([
        [ProtocolType.REQUEST_BODY, RequestBody.TOKEN_PATH_CONTENT_JSON_SCHEMA_PROPERTIES],
        [ProtocolType.URL_ENCODED, RequestBody.TOKEN_PATH_CONTENT_FORM_SCHEMA_PROPERTIES],
        [ProtocolType.PARAMETERS, RequestBody.TOKEN_PATH_CONTENT_FORM_SCHEMA_PROPERTIES]
    ] as [ProtocolType, string][]);

    private readonly _contentType: string;
    private readonly _fields: Array<IField>;

    constructor(contentType: string, fields: Array<IField>) {
        this._contentType = contentType;
        this._fields = fields;
    }

    get contentType(): string {
        return this._contentType;
    }

    get fields(): Array<IField> {
        return this._fields;
    }

    public needExtract(): boolean {
        return false;
    }


    public static findTokenPath(protocolType: ProtocolType): string | undefined {
        return this.TOKEN_PATH_MAP.get(protocolType);
    }

    toJSON() {
        return {
            contentType: this._contentType,
            fields: this._fields
        }

    }

    public toString(): string {
        return `(${this.fields.length}) Request Body fields:[\n${this._fields.map(field => field.toString()).join('\n')}\n]`
    }
}