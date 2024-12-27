import Parameter from "@/type/open-api/sub/parameter";
import IParsable from "@/type/open-api/protocol/i-parsable";
import InType from "@/type/open-api/constant/in-type";

export default class Formdata implements IParsable {

    private readonly _parameters: Array<Parameter>

    constructor(parameters: Array<Parameter>) {
        this._parameters = parameters;
    }
    get parameters(): Array<Parameter> {
        return this._parameters;
    }

    needExtract(): boolean {
        return this._parameters.some(param => param.in.value === InType.PATH.value);
    }

    public toString(): string {
        return `(${this._parameters.length}) formdata parameter:[\n${this._parameters.map(param => param.toString()).join('\n')}\n]`
    }

    toJSON() {
        return {
            parameters: this._parameters
        }
    }
}