import IPostmanNode from "@/type/postman/i-postman-node";
import PostmanRequest from "@/type/postman/postman-request";
import Path from "@/type/path";

export default class PostmanRequestWrapper implements IPostmanNode {
    private readonly _name: string;
    private readonly _request: PostmanRequest;

    constructor(name: string, request: PostmanRequest) {
        this._name = name
        this._request = request
    }

    get path(): Path {
        const joined = this._request.url.path.map(each => '/' + each).join('');
        return new Path(`${joined}:${this._request.method}`);
    }

    toJSON() {
        return {
            name: this._name,
            request: this._request
        }
    }
}
