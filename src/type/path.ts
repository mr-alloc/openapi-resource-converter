import {minimatch} from "minimatch";

export default class Path {

    private readonly _value: string
    private readonly _array: Array<string>

    constructor(value: string) {
        this._value = value
        const array = value.split("/");
        this._array = array.slice(1, array.length);
    }

    get value(): string {
        return this._value;
    }

    get array(): Array<string> {
        return this._array;
    }

    get length(): number {
        return this._array.length;
    }

    get lastValue() {
        return this._array[this._array.length - 1];
    }

    public subset(index: number) {
        return Path.of(this._array.slice(0, index +1));
    }

    public isLastPath(depth: number) {
        return this._array.length === depth;
    }

    static of(array: Array<string>): Path {
        return new Path(array.map(value => `/${value}`).join(""));
    }

    static ofValue(path: string) {
        return new Path(path);
    }

    public indexOf(index: number) {
        return this._array[index];
    }


    public matches(path: Path): boolean {
        return minimatch(path.value, this._value);
    }

    public toString(): string {
        return this._value;
    }

    public equals(other: Path) {
        return this._value === other.value;
    }
}
