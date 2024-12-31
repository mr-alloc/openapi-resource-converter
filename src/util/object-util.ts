
export function toProps(object: any | undefined): Array<Property> {
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

export function getDeepProps(object: any | undefined, tokens: Array<string>): Array<Property> {
    if (tokens.length === 0) {
        return toProps(object);
    }

    return getDeepPropsRecursive(object, tokens, 0);
}

function getDeepPropsRecursive(property: any, tokens: Array<string>, index: number): Array<Property> {
    const parseTarget = property?.[tokens[index]];
    const hasDepth = tokens.length - 1 > index;
    if (hasDepth && parseTarget) {
        return getDeepPropsRecursive(parseTarget, tokens, index + 1);
    }

    return toProps(parseTarget);
}

export function getDeepProp(object: any = {}, tokens: Array<string>): Property {
    if (tokens.length === 0) {
        return new Property('', object);
    }

    return getDeepPropRecursive(object, tokens, 0);
}

function getDeepPropRecursive(property: any, tokens: Array<string>, index: number): Property {
    const parseTarget = property?.[tokens[index]];
    const hasDepth = tokens.length -1 > index;
    if (hasDepth && parseTarget) {
        return getDeepPropRecursive(parseTarget, tokens, index +1);
    }
    return new Property(tokens[index], parseTarget);
}

export function hasProp(object: any | undefined, key: string): boolean {
    return object && object[key] !== undefined;
}

export function hasDeepProp(object: any | undefined, tokens: Array<string>) {
    if (!object || tokens.length === 0) {
        return false;
    }

    return hasDeepPropRecursive(object, tokens, 0);
}

function hasDeepPropRecursive(property: any, tokens: Array<string>, index: number): boolean {
    const parseTarget = property?.[tokens[index]];
    const hasDepth = tokens.length - 1 > index;
    if (hasDepth && parseTarget) {
        return hasDeepPropRecursive(parseTarget, tokens, index + 1);
    }
    return parseTarget !== undefined;
}

export function getProp<T>(object: any | undefined, key: string): T {
    return object[key]! as T;
}

export function getPropOrDefault<T>(object: any | undefined, key: string, defaultValue: T): T {
    return  object[key] ?? defaultValue;
}

export function getPropRecursive<T>(object: any | undefined, tokenPath: string): T {
    if (tokenPath === '') {
        return object;
    }
    const tokens = tokenPath.split('.');
    return getPropRecursiveInternal<T>(object, tokens, 0);
}

function getPropRecursiveInternal<T>(object: any, tokens: Array<string>, index: number): T {
    const parseTarget = object?.[tokens[index]];
    const hasDepth = tokens.length - 1 > index;
    if (hasDepth && parseTarget) {
        return getPropRecursiveInternal(parseTarget, tokens, index + 1);
    }

    return parseTarget;
}

export function applyOrDefault<I, D>(object: I | undefined | null, defaultValue: D, applyFunction: (input: I) => D) {
    if (object) {
        return applyFunction(object);
    }

    return defaultValue;
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

    public getTypeValue<T>(): T {
        return this._value as T;
    }

    public toString(): string {
        return `${this._name}: ${JSON.stringify(this._value)}`;
    }
}
