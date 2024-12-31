declare type FormdataType = 'text' | 'file';

export default class PostmanFormdata {
    private readonly _key: string;
    private readonly _value: string;
    private readonly _type: FormdataType;
    private readonly _description: string;

    public constructor(key: string, value: string, type: FormdataType, description: string) {
        this._key = key
        this._value = value
        this._type = type
        this._description = description
    }

    public toJSON() {
        return {
            key: this._key,
            value: this._value,
            type: this._type,
            description: this._description
        }
    }
}
