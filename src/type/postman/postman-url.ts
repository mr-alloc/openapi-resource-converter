import {split} from "@/util/collection-util";
import {raw} from "express";
import * as path from "path";

export default class PostmanUrl {

    private readonly _raw: string
    private readonly _protocol: string
    private readonly _host: Array<string>
    private readonly _path: Array<string>

    constructor(raw: string, protocol: string, host: Array<string>, path: Array<string>) {
        this._raw = raw
        this._protocol = protocol
        this._host = host
        this._path = path
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

    static of(host: string, endPoint: string): PostmanUrl {
        return new PostmanUrl(
            `${host}${endPoint}`,
            '',
            [host],
            split(endPoint, '/')
        )
    }
}
