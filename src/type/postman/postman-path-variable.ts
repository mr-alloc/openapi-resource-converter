import DataType from "@/type/open-api/constant/data-type";

export default class PostmanPathVariable {

    private readonly _id: string;
    private readonly _key: string;
    private readonly _value: string;
    private readonly _type: DataType;
    private readonly _name: string;
    private readonly _description: string;


    public constructor(id: string, key: string, value: string, type: DataType, name: string, description: string) {
        this._id = id;
        this._key = key;
        this._value = value;
        this._type = type;
        this._name = name;
        this._description = description;
    }


    get id(): string {
        return this._id;
    }

    get key(): string {
        return this._key;
    }

    get value(): string {
        return this._value;
    }

    get type(): DataType {
        return this._type;
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }
}
