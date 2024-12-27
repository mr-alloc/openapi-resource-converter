import DataType from "@/type/open-api/constant/data-type";
import DataFormat from "@/type/open-api/constant/data-format";
import IField from "@/type/open-api/sub/i-field";
import {getProp, getPropOrDefault, Property} from "@/util/object-util";
import NamedLiteral from "@/type/open-api/constant/named-literal";

export default class ValueField implements IField {

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

    public static fromProperty(property: Property) {
        return new ValueField(
            property.name,
            getPropOrDefault(property.value, NamedLiteral.DESCRIPTION, ''),
            DataType.fromValue(getProp(property.value, NamedLiteral.TYPE)),
            DataFormat.fromValue(getProp(property.value, NamedLiteral.FORMAT)),
            '',
            getPropOrDefault(property.value, NamedLiteral.EXAMPLE, '')
        );
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