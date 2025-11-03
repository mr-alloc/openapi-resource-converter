import { toMap } from "@/util/collection-util";

export default class InType {

    static readonly NONE = new InType('');
    static readonly QUERY = new InType('query'); //Path variable
    static readonly PATH = new InType('path'); //Query Parameter
    static readonly HEADER = new InType('header');

    private static readonly CACHED = toMap(InType.values(), (type) => type.value);
    private readonly _value: string;
    private constructor(value: string) {
        this._value = value;
    }

    static fromValue(value: string): InType {
        return InType.CACHED.get(value) ?? InType.NONE;
    }

    get value(): string {
        return this._value;
    }

    static values() {
        return [InType.QUERY, InType.PATH, InType.HEADER];
    }
}