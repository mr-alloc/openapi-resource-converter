import Parameter from "@/type/open-api/sub/parameter";
import {isEmpty} from "@/util/string-util";

export default class PostmanQuery {
    private readonly _key: string;
    private readonly _value: string;
    private readonly _description: string;

    constructor(key: string, value: string, description: string) {
        this._key = key;
        this._value = value;
        this._description = description;
    }

    get key(): string {
        return this._key;
    }

    get value(): string {
        return this._value;
    }

    get description(): string {
        return this._description;
    }

    static of(param: Parameter): PostmanQuery {
        //value는 변수나 기본값으로 쓰일수 있기 때문에, 추후 {{param}}처럼 하는것을 고려
        return new PostmanQuery(param.name, '', param.description)
    };

    toJSON() {
        const result =  {
            key: this._key,
            description: this._description,
        } as unknown as {
            key: string;
            description: string;
            value?: string;
        }
        if ( ! isEmpty(this._value)) {
            result.value = this._value;
        }

        return result;
    }
}