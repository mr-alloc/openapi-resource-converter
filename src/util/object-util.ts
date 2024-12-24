export function toProps(object: any | undefined) {
    return Object.entries(object ?? {}).map(([key, value]) => new Property(key, value));
}

export function withProps(object: any | undefined, callback: (property: Property) => void) {
    return Object.entries(object ?? {}).forEach(([key, value]) => callback(new Property(key, value)));
}

export function checkPath(property: Array<Property>, tokenPath: string): boolean {
    if (tokenPath === '') {
        return true;
    }
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

export function getProps(object: any | undefined, tokenPath: string): Array<Property> {
    if (tokenPath === '') {
        return toProps(object);
    }
    const tokens = tokenPath.split('.');
    return getPropsRecursive(object, tokens, 0);
}

function getPropsRecursive(property: any, tokens: Array<string>, index: number): Array<Property> {
    const parseTarget = property?.[tokens[index]];
    const hasDepth = tokens.length - 1 > index;
    if (hasDepth && parseTarget) {
        return getPropsRecursive(parseTarget, tokens, index + 1);
    }

    return toProps(parseTarget);
}

export function hasProp(object: any | undefined, key: string): boolean {
    return object && object[key] !== undefined;
}

export function getProp<T>(object: any | undefined, key: string): T {
    return object[key]! as T;
}

export function getPropOrDefault<T>(object: any | undefined, key: string, defaultValue: T): T {
    return  object[key] ?? defaultValue;
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