import DataType from "@/type/open-api/constant/data-type";
import IField from "@/type/open-api/sub/i-field";

export default class ObjectField implements IField {

    private readonly _name: string;
    private readonly _description: string;
    private readonly _type: DataType;
    private readonly _fields: Array<IField>;
    private readonly _superClass: boolean;

    constructor(name: string, description: string, type: DataType, fields: Array<IField>, superClass: boolean) {
        this._name = name;
        this._description = description;
        this._type = type;
        this._fields = fields;
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

    get fields(): Array<IField> {
        return this._fields;
    }

    get isSuperClass(): boolean {
        return this._superClass;
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
