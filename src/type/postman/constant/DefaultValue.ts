import DataType from "@/type/open-api/constant/DataType";
import DataFormat from "@/type/open-api/constant/DataFormat";

export default class DefaultValue {

    private static readonly STRING = new DefaultValue(DataType.STRING, DataFormat.NONE, "", (value: string) => value);
    private static readonly DOUBLE = new DefaultValue(DataType.NUMBER, DataFormat.DOUBLE, "0.0", parseFloat);
    private static readonly FLOAT = new DefaultValue(DataType.NUMBER, DataFormat.FLOAT, "0.0", parseFloat);
    private static readonly INT = new DefaultValue(DataType.INTEGER, DataFormat.INT32, "0", parseInt);
    private static readonly LONG = new DefaultValue(DataType.INTEGER, DataFormat.INT64, "0", parseInt);
    private static readonly BOOLEAN = new DefaultValue(DataType.BOOLEAN, DataFormat.NONE, "false", (value: string) => value === 'true');

    private readonly _type: DataType;
    private readonly _format: DataFormat;
    private readonly _value: string;
    private readonly _parser: (value: string) => any;

    private constructor(type: DataType, format: DataFormat, value: string, parser: (value: string) => any) {
        this._type = type
        this._format = format
        this._value = value
        this._parser = parser;
    }

    get value(): string {
        return this._value;
    }

    get typeValue(): any {
        return this._parser(this._value);
    }

    static fromTypeFormat(type: DataType, format: DataFormat) {
        switch (type) {
            case DataType.STRING:
                return DefaultValue.STRING;
            case DataType.NUMBER:
                switch (format) {
                    case DataFormat.DOUBLE:
                        return DefaultValue.DOUBLE;
                    case DataFormat.FLOAT:
                        return DefaultValue.FLOAT;
                    default:
                        return DefaultValue.DOUBLE;
                }
            case DataType.INTEGER:
                switch (format) {
                    case DataFormat.INT32:
                        return DefaultValue.INT;
                    case DataFormat.INT64:
                        return DefaultValue.LONG;
                    default:
                        return DefaultValue.INT;
                }
            case DataType.BOOLEAN:
                return DefaultValue.BOOLEAN;
            default:
                return DefaultValue.STRING;
        }
    }
}