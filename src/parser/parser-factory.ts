import IParser from "@/parser/i-parser";
import ProtocolType from "@/type/open-api/constant/protocol-type";
import serAdapter from "@/parser/request-body-parser";
import FormDataParser from "@/parser/form-data-parser";
import IParsable from "@/type/open-api/protocol/i-parsable";
import RequestBodyParser from "@/parser/request-body-parser";

export default class ParserFactory {

    private static INSTANCE: ParserFactory = new ParserFactory();
    private static readonly PARSER_MAP: Map<ProtocolType, IParser<IParsable>> = new Map<ProtocolType, IParser<IParsable>>([
        [ProtocolType.REQUEST_BODY, RequestBodyParser.getInstance()],
        [ProtocolType.PARAMETERS, FormDataParser.getInstance()]
    ]);

    private constructor() {
    }

    public static getInstance(): ParserFactory {
        return ParserFactory.INSTANCE;
    }

    public getParser(protocolType: ProtocolType): IParser<IParsable> | undefined {
        return ParserFactory.PARSER_MAP.get(protocolType);
    }
}