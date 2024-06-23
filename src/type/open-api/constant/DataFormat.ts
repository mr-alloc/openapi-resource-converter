import CollectionUtil from "@/util/CollectionUtil";

export default class DataFormat {
    static readonly INT32 = new DataFormat("int32");
    static readonly INT64 = new DataFormat("int64");
    static readonly FLOAT = new DataFormat("float");
    static readonly DOUBLE = new DataFormat("double");
    static readonly NONE = new DataFormat("none");


    private static readonly CACHED = CollectionUtil.toMap(DataFormat.values(), (dataFormat) => dataFormat.value);
    private readonly _value: string;
    constructor(value: string) {
        this._value = value;
    }

    get value(): string {
        return this._value;
    }

    static values(): Array<DataFormat>  {
        return Array.of(
            DataFormat.INT32,
            DataFormat.INT64,
            DataFormat.FLOAT,
            DataFormat.DOUBLE,
            DataFormat.NONE
        )
    }

    static fromValue(value: string) {
        return DataFormat.CACHED.get(value) ?? DataFormat.NONE;
    }

    public toJSON() {
        return {
            value: this._value
        }
    }
}