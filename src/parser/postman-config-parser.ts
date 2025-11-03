import {parse} from 'yaml';
import {getDeepProps, getProp, hasProp, Property} from "@/util/object-util";
import PostmanHeader from "@/type/postman/postman-header";
import CaseMode from "@/type/postman/constant/case-mode";
import {isEmpty} from "@/util/string-util";
import ParsedPostmanOption from "@/type/postman/parsed-postman-option";
import TypeValue from "@/type/postman/type-value";
import Path from "@/type/path";
import PostmanRequestWrapperTemplate from "@/type/postman/postman-request-wrapper-template";
import RequestMode from "@/type/postman/constant/request-mode";
import IPostmanRequestBody from "@/type/postman/i-postman-request-body";
import PostmanFormdata from "@/type/postman/postman-formdata";

export default class PostmanConfigParser {

    private readonly KEY_POSTMAN = 'postman';
    private readonly KEY_HOST = 'host';
    private readonly KEY_EXCLUDE_PATH = 'exclude-path';
    private readonly KEY_HEADERS = 'headers';
    private readonly KEY_CASE = 'case';
    private readonly KEY_PLACEHOLDER = 'placeholders';
    private readonly KEY_REQUEST_WRAPPER = 'request-wrapper';


    public parse(yaml: string): ParsedPostmanOption {
        const parsed: any = parse(yaml);
        if ( ! hasProp(parsed, this.KEY_POSTMAN)) {
            return ParsedPostmanOption.ofDefault();
        }

        const postman = getProp<any>(parsed, this.KEY_POSTMAN);

        const host = this.parseHost(postman);
        const excludePath = this.parseExcludePath(postman);
        const headers = this.parseHeaders(postman);
        const parseCase = this.parseCase(postman);
        const placeholders = this.parsePlaceholder(postman);
        const templates = this.parseRequestWrapper(postman);

        return new ParsedPostmanOption(host, excludePath, headers, parseCase, placeholders, templates);
    }

    private parseHost(config: any): string {
        if ( ! hasProp(config, this.KEY_HOST)) {
            return '{{url}}'
        }

        return getProp<string>(config, this.KEY_HOST);
    }

    private parseExcludePath(config: any): Array<Path> {
        if ( ! hasProp(config, this.KEY_EXCLUDE_PATH)) {
            return [Path.of([])];
        }

        const paths = getProp<string[]>(config, this.KEY_EXCLUDE_PATH);
        if ( ! this.isStringArray(paths)) {
            return [Path.of([])];
        }

        return paths.map(path => new Path(path));
    }

    private parseHeaders(config: any): Array<PostmanHeader> {
        if ( ! hasProp(config, this.KEY_HEADERS)) {
            return [];
        }

        const prop = getDeepProps(config, [this.KEY_HEADERS]);
        if ( ! Array.isArray(prop)) {
            return [];
        }

        return prop.map((header: Property) => new PostmanHeader(header.name, header.getTypeValue<string>()));
    }

    private parseCase(config: any): CaseMode {
        if ( ! hasProp(config, this.KEY_CASE)) {
            return CaseMode.CAMEL;
        }

        const caseMode = getProp<string>(config, this.KEY_CASE);
        const found = CaseMode.values().find(mode => mode.value === caseMode);
        if (!found) {
            return CaseMode.CAMEL;
        }

        return found;
    }

    private isStringArray(value: any): value is string[] {
        return Array.isArray(value) && value.every(item => typeof item === 'string');
    }

    private parsePlaceholder(config: any): Map<string, TypeValue> {
        const map = new Map<string, TypeValue>();
        if ( ! hasProp(config, this.KEY_PLACEHOLDER)) {
            return map;
        }

        const properties = getDeepProps(config, [this.KEY_PLACEHOLDER]);
        for (const property of properties) {
            if (! hasProp(property, 'type') || ! hasProp(property, 'value')) {
                continue;
            }

            const type = getProp<string>(property, 'type');
            const value = getProp<string>(property, 'value');

            if (isEmpty(type) || isEmpty(value)) {
                continue;
            }

            const typeValue = new TypeValue(type, value);

            map.set(property.name, typeValue);
        }
        return map;
    }

    private parseRequestWrapper(config: any) {
        if ( ! hasProp(config, this.KEY_REQUEST_WRAPPER)) {
            return [];
        }

        const wrapperConfig = getProp<Array<any>>(config, this.KEY_REQUEST_WRAPPER);
        if ( ! Array.isArray(wrapperConfig)) {
            return [];
        }

        return wrapperConfig.filter((wrapper) => this.requestWrapperFilter(wrapper))
            .map(wrapper => this.parseWrapperPolicy(wrapper));
    }

    private requestWrapperFilter(wrapper: any): boolean {
        const requiredCondition = hasProp(wrapper, 'path') && hasProp(wrapper, 'type');
        if (!requiredCondition) {
            return false;
        }

        const type = getProp<string>(wrapper, 'type');
        const requestMode = RequestMode.fromValue(type);
        if (requestMode.isNone) {
            return false;
        }

        if (requestMode.equalsValue(RequestMode.RAW)) {
            return hasProp(wrapper, 'format');
        } else if (requestMode.equalsValue(RequestMode.FORMDATA)) {
            return hasProp(wrapper, 'values');
        }

        return false;
    }

    private parseWrapperPolicy(wrapper: any): PostmanRequestWrapperTemplate {
        const path = new Path(getProp<string>(wrapper, 'path'));
        const mode = RequestMode.fromValue(getProp<string>(wrapper, 'type'));
        switch (mode) {
            case RequestMode.RAW: {
                const format = getProp<string>(wrapper, 'format');
                return PostmanRequestWrapperTemplate.ofConfig(path, mode, (str: IPostmanRequestBody) => {
                    //beautify in postman raw body
                    return format.replace('${body}', JSON.stringify(str, null,));
                });
            }
            case RequestMode.FORMDATA: {
                const values = getProp<Array<any>>(wrapper, 'values');
                const parameters = new Array<PostmanFormdata>();
                for (const param of values) {
                    if (!hasProp(param, 'name') || !hasProp(param, 'value')) {
                        throw new Error('Invalid formdata parameter');
                    }
                    const name = getProp<string>(param, 'name');
                    const value = getProp<string>(param, 'value');
                    const description = getProp<string>(param, 'description');

                    parameters.push(new PostmanFormdata(name, value, 'text', description,));
                }
                return PostmanRequestWrapperTemplate.ofConfig(path, mode, undefined, parameters);
            }
            default: throw new Error('Invalid request mode');
        }
    }
}
