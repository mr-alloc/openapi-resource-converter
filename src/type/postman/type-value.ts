import DataType from "@/type/open-api/constant/data-type";

export default class TypeValue {

    private readonly _type: DataType;
    private readonly _value: string;

    constructor(type: string, value: string) {
        this._type = DataType.fromValue(type);
        this._value = value;
    }

    get type(): DataType {
        return this._type;
    }

    get value(): string {
        return this._value;
    }
}