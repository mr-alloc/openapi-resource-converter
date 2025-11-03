import PostmanHeader from "@/type/postman/postman-header";
import PostmanUrl from "@/type/postman/postman-url";
import PostmanBodyWrapper from "@/type/postman/postman-body-wrapper";
import HttpMethod from "@/type/open-api/constant/http-method";
import {method} from "lodash";
import * as url from "url";

export default class PostmanRequest {

    private readonly _method: string;
    private readonly _header: Array<PostmanHeader>;
    private readonly _url: PostmanUrl;
    private readonly _body?: PostmanBodyWrapper;

    public constructor(method: HttpMethod, header: Array<PostmanHeader>, url: PostmanUrl,  body?: PostmanBodyWrapper) {
        this._method = method.value.toUpperCase();
        this._header = header;
        this._url = url;
        this._body = body;
    }


    get method(): string {
        return this._method;
    }

    get header(): Array<PostmanHeader> {
        return this._header;
    }

    get body(): PostmanBodyWrapper | undefined {
        return this._body;
    }

    get url(): PostmanUrl {
        return this._url;
    }

    public toJSON() {
        const result = {
            method: this._method,
            header: this._header,
            url: this._url
        } as unknown as {
            method: string,
            header: Array<PostmanHeader>,
            url: PostmanUrl,
            body?: PostmanBodyWrapper
        }

        if (this._body) {
            result.body = this._body;
        }

        return result;
    }
}
