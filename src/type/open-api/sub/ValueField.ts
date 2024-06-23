import DataType from "@/type/open-api/constant/DataType";
import DataFormat from "@/type/open-api/constant/DataFormat";
import Field from "@/type/open-api/sub/Field";

export default class ValueField implements Field {

    private readonly _name: string;
    private readonly _description: string;
    private readonly _type: DataType;
    private readonly _format: DataFormat;
    private readonly _value: string;
    private readonly _example: string;

    constructor(name: string, description: string, type: DataType, format: DataFormat, value: string, example: string) {
        this._name = name;
        this._description = description;
        this._type = type;
        this._format = format;
        this._value = value;
        this._example = example;
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get type(): DataType {
        return this._type;
    }

    get format(): DataFormat {
        return this._format;
    }

    get value(): string {
        return this._value;
    }

    get example(): string {
        return this._example;
    }

    public toString(): string {
        return `- ${this._name} (${this._type.value}): ${this._description}`;
    }

    public toJSON() {
        return {
            name: this._name,
            description: this._description,
            type: this._type,
            format: this._format,
            value: this._value,
            example: this._example
        }
    }
}