import IPostmanNode from "@/type/postman/IPostmanNode";
import PostmanRequest from "@/type/postman/PostmanRequest";

export default class PostmanRequestWrapper implements IPostmanNode {
    private readonly _name: string;
    private readonly _request: PostmanRequest;

    constructor(name: string, request: PostmanRequest) {
        this._name = name
        this._request = request
    }

    get path(): string {
        return this._name
    }

    toJSON() {
        return {
            "name": this._name,
            "request": this._request
        }
    }
}