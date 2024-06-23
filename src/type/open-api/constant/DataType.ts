import CollectionUtil from "@/util/CollectionUtil";

export default class DataType {

    static readonly STRING = new DataType("string");
    static readonly NUMBER = new DataType("number");
    static readonly INTEGER = new DataType("integer");
    static readonly BOOLEAN = new DataType("boolean");
    static readonly OBJECT = new DataType("object");
    static readonly NONE = new DataType("none");

    private static readonly CACHED = CollectionUtil.toMap(DataType.values(), (dataType) => dataType.value);
    private readonly _value: string;
    constructor(value: string) {
        this._value = value;
    }

    get value(): string {
        return this._value;
    }

    static values(): Array<DataType>  {
        return Array.of(
            DataType.STRING,
            DataType.NUMBER,
            DataType.INTEGER,
            DataType.BOOLEAN,
            DataType.OBJECT,
            DataType.NONE
        )
    }

    static fromValue(value: string) {
        return DataType.CACHED.get(value) ?? DataType.NONE;
    }

    public equalsValue(value: string): boolean {
        return this._value === value;
    }

    public toJSON() {
        return {
            value: this._value
        }
    }

    public isObject(): boolean {
        return this._value === DataType.OBJECT.value;
    }
}