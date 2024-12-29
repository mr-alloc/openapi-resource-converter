import PostmanHeader from "@/type/postman/postman-header";
import PostmanUrl from "@/type/postman/postman-url";
import PostmanBodyWrapper from "@/type/postman/postman-body-wrapper";
import HttpMethod from "@/type/open-api/constant/http-method";
import {method} from "lodash";
import * as url from "url";

export default class PostmanRequest {

    private readonly _method: string;
    private readonly _header: Array<PostmanHeader>;
    private readonly _body: PostmanBodyWrapper;
    private readonly _url: PostmanUrl;

    constructor(method: HttpMethod, header: Array<PostmanHeader>, body: PostmanBodyWrapper, url: PostmanUrl) {
        this._method = method.value.toUpperCase();
        this._header = header;
        this._body = body;
        this._url = url;
    }


    get method(): string {
        return this._method;
    }

    get header(): Array<PostmanHeader> {
        return this._header;
    }

    get body(): PostmanBodyWrapper {
        return this._body;
    }

    get url(): PostmanUrl {
        return this._url;
    }

    toJSON() {
        return {
            "method": this._method,
            "header": this._header,
            "body": this._body,
            "url": this._url
        }
    }
}
