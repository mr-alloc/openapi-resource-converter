export class PostmanEventScript {
    private readonly _preRequest?: string;
    private readonly _postResponse?: string;

    constructor(preRequest?: string, postResponse?: string) {
        this._preRequest = preRequest;
        this._postResponse = postResponse;
    }


    get preRequest(): string | undefined {
        return this._preRequest;
    }

    get postResponse(): string | undefined {
        return this._postResponse;
    }
}