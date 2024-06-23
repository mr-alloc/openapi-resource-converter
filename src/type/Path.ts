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

    subset(index: number) {
        return Path.of(this._array.slice(0, index +1));
    }

    static of(array: Array<string>): Path {
        return new Path(array.map(value => `/${value}`).join(""));
    }

    static ofValue(path: string) {
        return new Path(path);
    }

    indexOf(index: number) {
        return this._array[index];
    }

    lastValue() {
        return this._array[this._array.length - 1];
    }
}