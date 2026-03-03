import DataType from "@/type/open-api/constant/data-type";
import Parameter from "@/type/open-api/sub/parameter";
import DefaultValue from "@/type/postman/constant/default-value";

export default class PostmanPathVariable {

    private readonly _key: string;
    private readonly _value: string;
    private readonly _type: DataType;
    private readonly _description: string;
    private readonly _required: boolean;


    public constructor(key: string, value: string, type: DataType, description: string, required: boolean) {
        this._key = key;
        this._value = value;
        this._type = type;
        this._description = description;
        this._required = required;
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

    get required(): boolean {
        return this._required;
    }

    get description(): string {
        return this._description;
    }

    public static ofParameters(parameters: Array<Parameter>) {
        return parameters.map(param => new PostmanPathVariable(
            param.name,
            DefaultValue.fromTypeFormat(param.type, param.format).value,
            param.type,
            param.description,
            param.required
        ));
    }

    public toJSON() {
        return {
            key: this._key,
            value: this._value,
            description: this._description,
            required: this._required,
        } as unknown as {
            key: string,
            value: string,
            type?: string,
            name?: string
            description: string,
            required: boolean
        };
    }

}
