import { parse } from 'yaml';
import {getProp, getProps, hasProp, Property} from "@/util/object-util";
import PostmanHeader from "@/type/postman/postman-header";
import CaseMode from "@/type/postman/constant/CaseMode";
import {string} from "yaml/dist/schema/common/string";
import {isEmpty} from "@/util/string-util";
import ParsedPostmanOption from "@/type/postman/parsed-postman-option";
import TypeValue from "@/type/postman/type-value";
import Path from "@/type/path";
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
        this.parseRequestWrapper(postman);
        console.log(`Parsed Postman option\n* Host: '${host}'\n* Exclude Path: ${excludePath}\n* Headers: ${headers}\n* Case: ${parseCase}\n* Placeholders: ${placeholders}`);

        return new ParsedPostmanOption(host, excludePath, headers, parseCase, placeholders);
    }

    private parseHost(config: any): string {
        if ( ! hasProp(config, this.KEY_HOST)) {
            return 'localhost'
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

        const prop = getProps(config, [this.KEY_HEADERS]);
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

        const properties = getProps(config, [this.KEY_PLACEHOLDER]);
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
            return;
        }
    }
}