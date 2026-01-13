export class PostmanEventScript {
    private readonly _preRequest?: string;
    private readonly _postResponse?: string;

    constructor(postRequest?: string, postResponse?: string) {
        this._preRequest = postRequest;
        this._postResponse = postResponse;
    }


    get preRequest(): string | undefined {
        return this._preRequest;
    }

    get postResponse(): string | undefined {
        return this._postResponse;
    }
}