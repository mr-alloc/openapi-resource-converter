export default  {
    toMap<T, K>(collection: T[], keyMapper: (t: T) => K): Map<K, T> {
        const map = new Map<K, T>();
        collection.forEach((t) => {
            map.set(keyMapper(t), t);
        });
        return map;
    },
    split(value: string, separator: string): Array<string> {
        const paths = value.split(separator)
        return paths.slice(1, paths.length)
    },
    toGroup<T, K>(collection: T [], keyMapper: (t: T) => K): Map<K, Array<T>> {
        const group = new Map<K, Array<T>>();
        collection.forEach((t) => {
            const key = keyMapper(t);
            if (!group.has(key)) {
                group.set(key, []);
            }
            group.get(key)?.push(t);
        });
        return group
    },
    groupingAndThen<T, K, R>(collection: T[], keyMapper: (t: T) => K, finisher: (grouped: Array<T>) => R): Map<K, R> {
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
    },
    mapToObject<T>(map: Map<string, any>): any {
        const obj: any = {};
        for (const [key, value] of map.entries()) {
            if (value instanceof Map) {
                obj[key] = this.mapToObject(value); // 중첩된 Map 객체를 재귀적으로 변환
            } else {
                obj[key] = value; // 기본 값 설정
            }
        }
        return obj;
    }
}