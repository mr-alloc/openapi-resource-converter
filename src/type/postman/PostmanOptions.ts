export default class PostmanOptions {
    private readonly _raw: RawOption

    constructor(raw: RawOption) {
        this._raw = raw
    }

    static of(language: string) {
        return new PostmanOptions(new RawOption(language));
    }

    toJSON() {
        return {
            "raw": this._raw
        }
    }
}

class RawOption {
    private readonly _language: string

    constructor(language: string) {
        this._language = language
    }

    toJSON() {
        return {
            "language": this._language
        }
    }
}