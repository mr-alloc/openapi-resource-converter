import {split, toMap} from "@/util/collection-util";
import {raw} from "express";
import * as path from "path";
import PostmanPathVariable from "@/type/postman/postman-path-variable";
import Path from "@/type/path";
import ApiSpecification from "@/type/open-api/api-specification";
import PostmanQuery from "./postman-query";

export default class PostmanUrl {

    private readonly _raw: string
    private readonly _protocol: string
    private readonly _host: Array<string>
    private readonly _path: Array<string>
    private readonly _variable: Array<PostmanPathVariable>
    private readonly _query: Array<PostmanQuery>

    public constructor(host: string, spec: ApiSpecification, variables: Array<PostmanPathVariable>) {
        const changed = variables.reduce((origin, variable) => {
            const template = `{${variable.key}}`;
            return origin.replace(template, `:${variable.key}`);
        }, spec.path.value);
        const bindPath = new Path(changed);
        this._raw = `${host}${bindPath.value}`;
        this._protocol = ''
        this._host = [host]
        this._path = bindPath.array
        this._variable = variables;
        this._query = spec.parameters?.values.map(PostmanQuery.of) ?? [];
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
            query?: Array<PostmanQuery>,
        }

        if (this._protocol) {
            result.protocol = this._protocol;
        }

        if (this._variable.length !== 0) {
            result.variable = this._variable;
        }

        if (this._query.length !== 0) {
            result.query = this._query;
        }

        return result;
    }
}
