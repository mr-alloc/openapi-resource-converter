export function toProps(object: any | undefined) {
    return Object.entries(object ?? {}).map(([key, value]) => new Property(key, value));
}

export function withProps(object: any | undefined, callback: (property: Property) => void) {
    return Object.entries(object ?? {}).forEach(([key, value]) => callback(new Property(key, value)));
}

export function checkPath(property: Array<Property>, tokenPath: string): boolean {
    const tokens = tokenPath.split('.');
    return checkPathRecursive(property, tokens, 0);
}

function checkPathRecursive(property: Array<Property>, tokens: Array<string>, index: number): boolean {
    const parseTarget = property.find(p => p.name === tokens[index]);
    const hasDepth = tokens.length - 1 > index;
    if (hasDepth && parseTarget) {
        return checkPathRecursive(parseTarget.value, tokens, index + 1);
    }

    return parseTarget !== undefined;
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