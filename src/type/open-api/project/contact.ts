export default class Contact {

    private readonly _email: string;
    private readonly _name: string;
    private readonly _url: string;

    constructor(email: string, name: string, url: string) {
        this._email = email;
        this._name = name;
        this._url = url;
    }

    get email(): string {
        return this._email;
    }

    get name(): string {
        return this._name;
    }

    get url(): string {
        return this._url;
    }

    static fromJson(json: any): Contact {
        return new Contact(
            json?.email ?? '',
            json?.name ?? '',
            json?.url ?? ''
        );
    }
}