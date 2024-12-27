import IParsable from "@/type/open-api/protocol/i-parsable";
import IField from "@/type/open-api/sub/i-field";
import ProtocolType from "@/type/open-api/constant/protocol-type";
import {ContentType} from "@/type/open-api/constant/content-type";

export default class RequestBody implements IParsable {

    private static readonly CONTENT_TYPE_MAP = new Map<ProtocolType, ContentType>([
        [ProtocolType.REQUEST_BODY, ContentType.APPLICATION_JSON],
        [ProtocolType.URL_ENCODED, ContentType.APPLICATION_X_WWW_FORM_URLENCODED],
    ] as [ProtocolType, ContentType][]);

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


    public static findContentType(protocolType: ProtocolType): ContentType {
        const contentType = this.CONTENT_TYPE_MAP.get(protocolType);
        if (!contentType) {
            throw new Error(`Not supported protocol type: ${protocolType}`);
        }
        return contentType;
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
