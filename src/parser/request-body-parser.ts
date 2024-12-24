import IParser from "@/parser/i-parser";
import RequestBody from "@/type/open-api/protocol/request-body";
import NamedLiteral from "@/type/open-api/constant/NamedLiteral";
import ValueField from "@/type/open-api/sub/ValueField";
import DataType from "@/type/open-api/constant/data-type";
import DataFormat from "@/type/open-api/constant/data-format";
import IField from "@/type/open-api/sub/i-field";
import ObjectField from "@/type/open-api/sub/ObjectField";
import ProtocolType from "@/type/open-api/constant/protocol-type";

export default class RequestBodyParser implements IParser<RequestBody> {

    private static readonly CONTENT_TYPE = "application/json"
    private static INSTANCE: RequestBodyParser = new RequestBodyParser();
    private constructor() {}

    static getInstance(): RequestBodyParser {
        return RequestBodyParser.INSTANCE;
    }

    parse(toBeParsed: any, tokenPath?: string, components?: Map<string, any>): RequestBody {
        const tokens = tokenPath?.split(NamedLiteral.TOKEN_PATH_DIVIDER) ?? [];
        return this.parseWithTokenPaths(toBeParsed, tokens, 0, components);
    }

    parseWithTokenPaths(toBeParsed: any, tokenPaths: Array<string>, index: number, components?: Map<string, any>): RequestBody {
        const parseTarget = toBeParsed[tokenPaths[index]];
        //$ref 확인후 처리 추가
        const hasRef = toBeParsed[NamedLiteral.REFERENCE_KEY];
        if (hasRef) {
            const fields = this.parseReference(toBeParsed, components);
            return new RequestBody(RequestBodyParser.CONTENT_TYPE, fields);
        }

        if (tokenPaths.length -1 > index && parseTarget) {
            return this.parseWithTokenPaths(parseTarget, tokenPaths, index + 1, components);
        }

        //마지막 인덱스 인경우: "properties"
        const fieldParser = InternalFieldParser.getInstance();
        const fields = Array.from(Object.entries(Object.assign({}, parseTarget)))
            .map(([name, metadata]) => fieldParser.parse(name, metadata));
        //1번째 파라미터는 Content-Type
        return new RequestBody(RequestBodyParser.CONTENT_TYPE, fields);
    }

    /**
     * $ref객체를 내부적으로 파싱하는 함수
     * @param toBeParsed
     * @param components
     */
    parseReference(toBeParsed: any, components?: Map<string, any>): Array<IField> {
        const referenced = components?.get(toBeParsed[NamedLiteral.REFERENCE_KEY]);
        const properties = referenced[NamedLiteral.PROPERTIES];

        if (!properties) {
            return [];
        }

        return Object.entries(properties)
            .map(([name, property]) => this.parseReferenceRecursive(property, name, components));
    }

    parseReferenceRecursive(toBeParsed: any, name: string, components?: Map<string, any>): IField {
        if (toBeParsed[NamedLiteral.REFERENCE_KEY]) {
            const fields = this.parseReference(toBeParsed, components);
            return new ObjectField(name, '', DataType.OBJECT, fields);
        }

        if (DataType.OBJECT.equalsValue(toBeParsed[NamedLiteral.TYPE]) && toBeParsed[NamedLiteral.PROPERTIES]) {
            const fields = Object.entries(toBeParsed[NamedLiteral.PROPERTIES])
                .map(([name, property]) => this.parseReferenceRecursive(property, name, components));
            //description은 임시처리
            return new ObjectField(name, '', DataType.OBJECT, fields);
        }
        const fieldParser = InternalFieldParser.getInstance();
        return fieldParser.parse(name, toBeParsed);
    }

    /**
     * RequestBody를 파싱하기위해 필요한 토큰 경로 반환
     */
    public getTokenPath(protocol: ProtocolType): string {
        return RequestBody.findTokenPath(protocol) ?? '';
    }

    /**
     * 토큰 경로가 존재하는지 확인
     * @param toBeParsed
     * @param tokenPath
     */
    checkPath(toBeParsed: any, tokenPath?: string): boolean {
        const tokens = tokenPath?.split(NamedLiteral.TOKEN_PATH_DIVIDER) ?? [];
        return this.checkPathRecursive(toBeParsed, tokens, 0);
    }

    /**
     * 토큰 경로가 존재하는지 재귀 호출로 확인
     * @param toBeParsed
     * @param tokens
     * @param index
     */
    checkPathRecursive(toBeParsed: any, tokens: Array<string>, index: number): boolean {
        const parseTarget = toBeParsed[tokens[index]];
        const hasDepth = tokens.length - 1 > index;
        if (hasDepth && parseTarget) {
            return this.checkPathRecursive(parseTarget, tokens, index + 1);
        }

        return parseTarget !== undefined;
    }

}



class InternalFieldParser {

    private static readonly INSTANCE: InternalFieldParser = new InternalFieldParser();

    private static readonly PROPERTY_DESCRIPTION = "description";
    private static readonly PROPERTY_TYPE = "type";
    private static readonly PROPERTY_FORMAT = "format";
    private static readonly PROPERTY_EXAMPLE = "example";

    private constructor() {}

    static getInstance(): InternalFieldParser {
        return InternalFieldParser.INSTANCE;
    }

    parse(name: string, property: any): ValueField {
        return new ValueField(
            name,
            property?.[InternalFieldParser.PROPERTY_DESCRIPTION] ?? '',
            DataType.fromValue(property?.[InternalFieldParser.PROPERTY_TYPE]),
            DataFormat.fromValue(property?.[InternalFieldParser.PROPERTY_FORMAT]),
            '',
            property?.[InternalFieldParser.PROPERTY_EXAMPLE] ?? ''
        );
    }
}
