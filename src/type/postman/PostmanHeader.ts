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
}
