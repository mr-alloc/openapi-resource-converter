import CollectionUtil from "@/util/CollectionUtil";

export default class InType {

    static readonly NONE = new InType('');
    static readonly QUERY = new InType('query'); //Path variable
    static readonly PATH = new InType('path'); //Query Parameter

    private static readonly CACHED = CollectionUtil.toMap(InType.values(), (type) => type.value);
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
        return [InType.QUERY, InType.PATH];
    }
}