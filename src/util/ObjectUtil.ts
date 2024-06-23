export function toProps(object: any | undefined) {
    return Object.entries(object ?? {}).map(([key, value]) => new Property(key, value));
}

export function withProps(object: any | undefined, callback: (property: Property) => void) {
    return Object.entries(object ?? {}).forEach(([key, value]) => callback(new Property(key, value)));
}

export class Property {
    private readonly _name: string;
    private readonly _value: any;

    constructor(name: string, value: any) {
        this._name = name;
        this._value = value;
    }

    get name(): string {
        return this._name;
    }

    get value(): any {
        return this._value;
    }
}