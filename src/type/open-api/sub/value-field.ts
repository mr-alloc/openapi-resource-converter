import DataType from "@/type/open-api/constant/data-type";
import DataFormat from "@/type/open-api/constant/data-format";
import IField from "@/type/open-api/sub/i-field";
import {getDeepProp, getProp, getPropOrDefault, Property} from "@/util/object-util";
import NamedLiteral from "@/type/open-api/constant/named-literal";
import {TypeFormat} from "@/type/open-api/sub/TypeFormat";

export default class ValueField implements IField {

    private readonly _name: string;
    private readonly _description: string;
    private readonly _type: DataType;
    private readonly _format: DataFormat;
    private readonly _items?: TypeFormat;
    private readonly _value?: string;
    private readonly _example?: string;
    private readonly _superClass: boolean

    constructor(property: Property, superClass: boolean) {
        this._name = property.name;
        this._description = getPropOrDefault(property.value, NamedLiteral.DESCRIPTION, '');
        this._type = DataType.fromValue(getProp(property.value, NamedLiteral.TYPE));
        this._format = DataFormat.fromValue(getDeepProp(property.value, [NamedLiteral.FORMAT]).value);
        if (this._type.isArray()) {
            const itemsTypeValue = getDeepProp(property.value, [NamedLiteral.ITEMS, NamedLiteral.TYPE]);
            const itemsFormatValue = getDeepProp(property.value, [NamedLiteral.ITEMS, NamedLiteral.FORMAT]);
            this._items = new TypeFormat(DataType.fromValue(itemsTypeValue.value), DataFormat.fromValue(itemsFormatValue.value))
        } else {
            this._value = '';
            this._example = getPropOrDefault(property.value, NamedLiteral.EXAMPLE, '');
        }
        this._superClass = superClass;
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

    get value(): string | undefined {
        return this._value;
    }

    get items(): TypeFormat | undefined {
        return this._items;
    }

    get example(): string | undefined {
        return this._example;
    }

    get isSuperClass(): boolean {
        return this._superClass;
    }

    public static fromProperty(property: Property, superClass: boolean) {
        return new ValueField(property, superClass);
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