import Parameter from "@/type/open-api/sub/parameter";
import DefaultValue from "@/type/postman/constant/default-value";

export default class PostmanHeader {
    private readonly _key: string;
    private readonly _value: string;

    constructor(key: string, value: string) {
        this._key = key
        this._value = value
    }

    getSeparatedValues(): Array<string> {
        return this._value
            .split(';')
            .map(value => value.trim())
    }

    toJSON() {
        return {
            "key": this._key,
            "value": this._value
        }
    }

    public toString() {
        return `${this._key}: ${this._value}`;
    }

    public static ofParameters(parameters: Array<Parameter>): Array<PostmanHeader> {
        return parameters.map(header => new PostmanHeader(
            header.name,
            DefaultValue.fromTypeFormat(header.type, header.format).value
        ));
    }
}
