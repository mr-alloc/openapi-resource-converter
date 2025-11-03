import {toMap} from "@/util/collection-util";

export default class DataType {

    public static readonly STRING = new DataType("string");
    public static readonly NUMBER = new DataType("number");
    public static readonly INTEGER = new DataType("integer");
    public static readonly BOOLEAN = new DataType("boolean");
    public static readonly OBJECT = new DataType("object");
    public static readonly ARRAY = new DataType("array");
    public static readonly NONE = new DataType("none");

    private static readonly CACHED = toMap(DataType.values(), (dataType) => dataType.value);
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
            DataType.ARRAY,
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
