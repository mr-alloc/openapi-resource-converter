import IParsable from "@/type/open-api/protocol/IParsable";
import Field from "@/type/open-api/sub/Field";

export default class RequestBody implements IParsable {

    private static readonly TOKEN_PATH_CONTENT_JSON_SCHEMA_PROPERTIES = "content.application/json.schema.properties";
    private static readonly TOKEN_PATH_CONTENT_FORM_SCHEMA_PROPERTIES = "content.application/x-www-form-urlencoded.schema.properties";
    private static readonly TOKEN_PATH_CONTENT_JSON_SCHEMA_REFERENCE = "content.application/json.schema.$ref";

    private readonly _contentType: string;
    private readonly _fields: Array<Field>;

    constructor(contentType: string, fields: Array<Field>) {
        this._contentType = contentType;
        this._fields = fields;
    }

    get contentType(): string {
        return this._contentType;
    }

    get fields(): Array<Field> {
        return this._fields;
    }

    needExtract(): boolean {
        return false;
    }

    static getTokenPath(): Array<string> {
        return Array.of(
            RequestBody.TOKEN_PATH_CONTENT_JSON_SCHEMA_PROPERTIES,
            RequestBody.TOKEN_PATH_CONTENT_FORM_SCHEMA_PROPERTIES,
            RequestBody.TOKEN_PATH_CONTENT_JSON_SCHEMA_REFERENCE
        );
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