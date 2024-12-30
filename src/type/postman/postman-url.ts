import {split} from "@/util/collection-util";
import {raw} from "express";
import * as path from "path";
import PostmanPathVariable from "@/type/postman/postman-path-variable";

export default class PostmanUrl {

    private readonly _raw: string
    private readonly _protocol: string
    private readonly _host: Array<string>
    private readonly _path: Array<string>
    private readonly _variable: Array<PostmanPathVariable>


    constructor(raw: string, protocol: string, host: Array<string>, path: Array<string>) {
        this._raw = raw
        this._protocol = protocol
        this._host = host
        this._path = path
        this._variable = [];
    }


    get raw(): string {
        return this._raw;
    }

    get protocol(): string {
        return this._protocol;
    }

    get host(): Array<string> {
        return this._host;
    }

    get path(): Array<string> {
        return this._path;
    }

    getHost(): Array<string> {
        return this._host
    }

    getPath(): Array<string> {
        return this._path
    }

    public static of(host: string, endPoint: string): PostmanUrl {
        return new PostmanUrl(
            `${host}${endPoint}`,
            '',
            [host],
            split(endPoint, '/')
        )
    }

    public toJSON() {
        const result = {
            raw: this._raw,
            host: this._host,
            path: this._path,
        } as unknown as {
            raw: string,
            protocol?: string,
            host: Array<string>,
            path: Array<string>,
            variable?: Array<PostmanPathVariable>
        }

        if (this._protocol) {
            result.protocol = this._protocol;
        }

        if (this._variable.length === 0) {
            result.variable = this._variable;
        }

        return result;
    }
}
