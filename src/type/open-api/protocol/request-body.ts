import IField from "@/type/open-api/sub/i-field";
import {ContentType} from "@/type/open-api/constant/content-type";

export default class RequestBody {

    public static readonly ALLOW_CONTENT_TYPES = [
        ContentType.APPLICATION_JSON,
        ContentType.APPLICATION_X_WWW_FORM_URLENCODED
    ]

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

    public toJSON() {
        return {
            contentType: this._contentType,
            fields: this._fields
        }

    }

    public toString(): string {
        return `(${this.fields.length}) Request Body fields:[\n${this._fields.map(field => field.toString()).join('\n')}\n]`
    }
}
