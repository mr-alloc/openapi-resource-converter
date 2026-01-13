export class PostmanEvent {
    private readonly _listen: string;
    private readonly _script: PostmanEventExecutableScript;

    private constructor(listen: string, script: PostmanEventExecutableScript) {
        this._listen = listen;
        this._script = script;
    }

    get listen(): string {
        return this._listen;
    }

    get script(): PostmanEventExecutableScript {
        return this._script;
    }

    public static ofPreRequest(script: PostmanEventExecutableScript): PostmanEvent {
        return new PostmanEvent('test', script);
    }

    public static ofPostResponse(script: PostmanEventExecutableScript): PostmanEvent {
        return new PostmanEvent('prerequest', script);
    }

    public toJSON() {
        return {
            listen: this._listen,
            script: this._script,
        }
    }
}

export class PostmanEventExecutableScript {
    private readonly _content: Array<string>;
    private readonly _type: string;
    private readonly _packages: any;
    private readonly _requests: any;

    public constructor(content: Array<string>, type: string = 'text/javascript') {
        this._content = content;
        this._type = type;
    }

    public toJSON() {
        return {
            exec: this._content,
            type: this._type,
            packages: this._packages,
            requests: this._requests
        }
    }
}