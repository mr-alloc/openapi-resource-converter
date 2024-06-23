export default class PostmanFormData {
    private readonly _key: string;
    private readonly _value: string;
    private readonly _type: string;
    private readonly _description: string;

    constructor(key: string, value: string, type: string, description: string) {
        this._key = key
        this._value = value
        this._type = type
        this._description = description
    }

    toJSON() {
        return {
            "key": this._key,
            "value": this._value,
            "type": this._type,
            "description": this._description
        }

    }
}