import DataType from "@/type/open-api/constant/DataType";
import Field from "@/type/open-api/sub/Field";

export default class ObjectField implements Field {

    private readonly _name: string;
    private readonly _description: string;
    private readonly _type: DataType;
    private readonly _fields: Array<Field>;

    constructor(name: string, description: string, type: DataType, fields: Array<Field>) {
        this._name = name;
        this._description = description;
        this._type = type;
        this._fields = fields;
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

    get fields(): Array<Field> {
        return this._fields;
    }

    public toJSON() {
        return {
            name: this._name,
            description: this._description,
            type: this._type,
            fields: this._fields
        }
    }
}
