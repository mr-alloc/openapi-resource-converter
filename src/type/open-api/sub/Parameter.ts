import InType from "@/type/open-api/constant/InType";
import DataType from "@/type/open-api/constant/DataType";
import DataFormat from "@/type/open-api/constant/DataFormat";

export default class Parameter {

    private readonly _name: string;
    private readonly _in: InType;
    private readonly _description: string;
    private readonly _required: boolean;
    private readonly _type: DataType;
    private readonly _format: DataFormat;

    constructor(name: string, inType: InType, description: string, required: boolean, type: DataType, format: DataFormat) {
        this._name = name;
        this._in = inType;
        this._description = description;
        this._required = required;
        this._type = type;
        this._format = format;
    }

    get name(): string {
        return this._name;
    }

    get in(): InType {
        return this._in;
    }

    get description(): string {
        return this._description;
    }

    get required(): boolean {
        return this._required;
    }

    get type(): DataType {
        return this._type;
    }

    get format(): DataFormat {
        return this._format;
    }

    public toString(): string {
        return `- ${this._name} (${this._type.value}): ${this._description}`
    }

    public toJSON() {
        return {
            name: this._name,
            in: this._in,
            description: this._description,
            required: this._required,
            type: this._type,
            format: this._format
        }
    }
}