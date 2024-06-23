import Contact from "@/type/open-api/project/Contact";

export default class ProjectInformation {

    private readonly _contact: Contact;
    private readonly _description: string;
    private readonly _title: string;
    private readonly _version: string;


    constructor(contact: Contact, description: string, title: string, version: string) {
        this._contact = contact;
        this._description = description;
        this._title = title;
        this._version = version;
    }

    get contact(): Contact {
        return this._contact;
    }

    get description(): string {
        return this._description;
    }

    get title(): string {
        return this._title;
    }

    get version(): string {
        return this._version;
    }

    static fromJson(jsonObject: any): ProjectInformation {
        return new ProjectInformation(
            Contact.fromJson(jsonObject?.contact),
            jsonObject?.description ?? '',
            jsonObject?.title ?? '',
            jsonObject?.version ?? ''
        );
    }
}