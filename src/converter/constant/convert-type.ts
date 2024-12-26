export class ConvertType {

    private static readonly POSTMAN = new ConvertType('postman-import file');

    private readonly _value: string;
    private constructor(value: string) {
        this._value = value;
    }

    get value(): string {
        return this._value;
    }
}