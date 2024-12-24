
export function toMap<T, K>(collection: T[], keyMapper: (t: T) => K): Map<K, T> {
    const map = new Map<K, T>();
    collection.forEach((t) => {
        map.set(keyMapper(t), t);
    });
    return map;
}

export function split(value: string, separator: string): Array<string> {
    const paths = value.split(separator)
    return paths.slice(1, paths.length)
}

export function toGroup<T, K>(collection: T [], keyMapper: (t: T) => K): Map<K, Array<T>> {
    const group = new Map<K, Array<T>>();
    collection.forEach((t) => {
        const key = keyMapper(t);
        if (!group.has(key)) {
            group.set(key, []);
        }
        group.get(key)?.push(t);
    });
    return group
}

export function groupingAndThen<T, K, R>(collection: T[], keyMapper: (t: T) => K, finisher: (grouped: Array<T>) => R): Map<K, R> {
    const group = new Map<K, Array<T>>();
    collection.forEach((t) => {
        const key = keyMapper(t);
        if (!group.has(key)) {
            group.set(key, []);
        }
        group.get(key)?.push(t);
    });

    const result = new Map<K, R>();
    group.forEach((value, key) => {
        result.set(key, finisher(value));
    });
    return result;
}

export function toValueMap<T, K, V>(
    contents: T[],
    keyMapper: (content: T) => K,
    valueMapper: (content: T, index: number) => V
): Map<K, V> {
    const map = new Map<K, V>()
    for (let i = 0;i < contents.length;i++) {
        const key: K = keyMapper(contents[i])
        if (map.has(key)) {
            throw Promise.reject(`Can\'t Mapped by duplicated key '${key}'`)
        }
        map.set(key, valueMapper(contents[i], i))
    }
    return map
}