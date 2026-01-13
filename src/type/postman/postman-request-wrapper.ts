import IPostmanNode from "@/type/postman/i-postman-node";
import PostmanRequest from "@/type/postman/postman-request";
import Path from "@/type/path";
import {PostmanEvent} from "@/type/postman/postman-event";

export default class PostmanRequestWrapper implements IPostmanNode {
    private readonly _name: string;
    private readonly _request: PostmanRequest;
    private readonly _event?: Array<PostmanEvent>;

    constructor(name: string, request: PostmanRequest, event?: Array<PostmanEvent>) {
        this._name = name
        this._request = request
        this._event = event
    }

    get path(): Path {
        const joined = this._request.url.path.map(each => '/' + each).join('');
        return new Path(`${joined}:${this._request.method}`);
    }

    public toJSON() {
        const value = {
            name: this._name,
            request: this._request
        } as unknown as {
            name: string;
            request: PostmanRequest;
            event?: Array<PostmanEvent>;
        }

        if (this._event) {
            value.event = this._event;
        }

        return value;
    }
}

