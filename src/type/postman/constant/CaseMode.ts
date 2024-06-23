export default class CaseMode {


    static readonly CAMEL = new CaseMode(0, /^[a-z]+(?:[A-Z][a-z]+)*$/gm,
        /([A-Z])/gm, (value) => value.toLowerCase(),
        (value) => value.toUpperCase());
    static readonly SNAKE = new CaseMode(1, /^[a-z]+(?:_[a-z]+)*$/gm,
        /(_[a-z0-9])/gm, (value) => value.toUpperCase().replace('_', ''),
        (value) => `_${value}`);

    private readonly _value: number;
    private readonly _casingRegexp: RegExp;
    private readonly _tokenMatcher: RegExp;
    private readonly _characterExtractor: (value: string) => string;
    private readonly _decorator: (value: string) => string;

    private constructor(
        value: number,
        casingRegexp: RegExp,
        tokenMatcher: RegExp,
        characterExtractor: (value: string) => string,
        decorator: (value: string) => string
    ) {        this._value = value;
        this._casingRegexp = casingRegexp;
        this._tokenMatcher = tokenMatcher;
        this._characterExtractor = characterExtractor;
        this._decorator = decorator;
    }


    static to(value: string, caseMode: CaseMode): string {
        const originCasing = CaseMode.detectCasing(value);
        if (originCasing === caseMode) return value;

        let result = value;
        //if still case of one.
        let captured;
        while((captured = originCasing._tokenMatcher.exec(result)) !== null) {
            //find and convert to target case.
            const target = captured?.[1];
            if (!target) throw new Error(`Cannot find token for value: ${value}`);

            const extracted = originCasing._characterExtractor(target);
            const decorated = caseMode._decorator(extracted);

            result = result.replace(target, decorated);
            originCasing._tokenMatcher.lastIndex = 0;
        }
        return result;
    }

    static detectCasing(value: string): CaseMode {
        const found = CaseMode.values().find(mode => {
            const isMatched = mode._casingRegexp.test(value);
            mode._casingRegexp.lastIndex = 0;
            return isMatched;
        });
        if (!found) throw new Error(`Cannot find casing for value: ${value}`);
        return found;
    }


    static values(): Array<CaseMode> {
        return [CaseMode.CAMEL, CaseMode.SNAKE];
    }
}
