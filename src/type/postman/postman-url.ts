import PostmanPathVariable from "@/type/postman/postman-path-variable";
import Path from "@/type/path";
import ApiSpecification from "@/type/open-api/api-specification";
import PostmanQuery from "./postman-query";
import PostmanConvertConfigures from "@/converter/postman/postman-convert-configures";
import PostmanRequestWrapperTemplate from "@/type/postman/postman-request-wrapper-template";
import DataType from "@/type/open-api/constant/data-type";
import {toMap} from "@/util/collection-util";
import InType from "@/type/open-api/constant/in-type";

export default class PostmanUrl {

    private readonly _raw: string
    private readonly _protocol: string
    private readonly _host: Array<string>
    private readonly _path: Array<string>
    private readonly _variable: Array<PostmanPathVariable>
    private readonly _query: Array<PostmanQuery>

    public constructor(configures: PostmanConvertConfigures, spec: ApiSpecification, variables: Array<PostmanPathVariable>) {
        const host = configures.host;
        const valuePlaceholder = configures.valuePlaceholder;
        const template = configures.getMatchedRequestWrapperTemplate(spec);
        const finalPath = this.makeFinalPath(template, spec, variables);
        const bindPath = new Path(finalPath);
        this._raw = `${host}${bindPath.value}`;
        this._protocol = ''
        this._host = [host]
        this._path = bindPath.array
        this._variable = variables;
        this._query = spec.parameters?.getValues(InType.QUERY).map(param => {
            let value = '';
            if (valuePlaceholder.has(param.name)) {
                const typeValue = valuePlaceholder.get(param.name)!;
                value = `{{${typeValue.value}}}`
            }
            return PostmanQuery.of(param, value)
        }) ?? [];
        this.ensureMatchingPathVariables(spec.path);
    }

    private makeFinalPath(
        template: PostmanRequestWrapperTemplate | undefined,
        spec: ApiSpecification,
        variables: Array<PostmanPathVariable>
    ): string {
        //경로변수 지정
        const replaced = spec.path.array
            .map(snippet => snippet.replace(/\{(\w+)}/g, ":$1"));
        return Path.of(replaced).value;
    }

    private ensureMatchingPathVariables(origin: Path) {
        const group = toMap(this._variable, (variable) => variable.key);
        //경로변수가 안맞다면 맞춰주기
        const pathVariables = origin.array
            .filter(snippet => (/\{(\w+)}/g.test(snippet)))
            .map(snippet => snippet.replace(/\{(\w+)}/g, "$1"));
        for (const pathVariable of pathVariables) {
            if (group.has(pathVariable)) continue;
            //경로에는 있지만, OpenAPI JSON에 변수가 없는경우 추가
            this._variable.push(new PostmanPathVariable(
                pathVariable,
                "", DataType.STRING, "", true
            ));
        }
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
