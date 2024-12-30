import DataType from "@/type/open-api/constant/data-type";
import Parameter from "@/type/open-api/sub/parameter";
import DefaultValue from "@/type/postman/constant/default-value";

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

    public static ofParameters(parameters: Array<Parameter>) {
        return parameters.map(param => new PostmanPathVariable(
            '', param.name, DefaultValue.fromTypeFormat(param.type, param.format).value, param.type, '', param.description
        ));
    }

    public toJSON() {
        const result = {
            key: this._key,
            value: this._value,
            description: this._description
        } as unknown as {
            id?: string,
            key: string,
            value: string,
            type?: string,
            name?: string
            description: string,
        };

        return result;
    }

}
