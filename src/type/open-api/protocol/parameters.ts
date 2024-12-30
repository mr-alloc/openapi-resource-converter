import Parameter from "@/type/open-api/sub/parameter";
import IParsable from "@/type/open-api/protocol/i-parsable";
import InType from "@/type/open-api/constant/in-type";

export default class Parameters implements IParsable {

    private readonly _values: Array<Parameter>

    public constructor(parameters: Array<Parameter>) {
        this._values = parameters;
    }

    get values(): Array<Parameter> {
        return this._values;
    }

    public needExtract(): boolean {
        return this._values.some(param => param.in.value === InType.PATH.value);
    }

    public getValues(inType: InType) {
        return this._values.filter(parameter => parameter.in.value === inType.value);
    }

    public toString(): string {
        return `(${this._values.length}) parameters: [\n${this._values.map(param => param.toString()).join('\n')}\n]`
    }

    public toJSON() {
        return {
            parameters: this._values
        }
    }

}
