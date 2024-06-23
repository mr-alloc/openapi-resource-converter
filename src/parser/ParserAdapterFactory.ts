import IParserAdapter from "@/parser/IParserAdapter";
import ProtocolType from "@/type/open-api/constant/ProtocolType";
import serAdapter from "@/parser/RequestBodyParserAdapter";
import FormDataParserAdapter from "@/parser/FormDataParserAdapter";
import IParsable from "@/type/open-api/protocol/IParsable";
import RequestBodyParserAdapter from "@/parser/RequestBodyParserAdapter";

export default class ParserAdapterFactory {

    private static INSTANCE: ParserAdapterFactory = new ParserAdapterFactory();
    private static readonly ADAPTER_MAP: Map<ProtocolType, IParserAdapter<IParsable>> = new Map<ProtocolType, IParserAdapter<IParsable>>([
        [ProtocolType.REQUEST_BODY, RequestBodyParserAdapter.getInstance()],
        [ProtocolType.PARAMETERS, FormDataParserAdapter.getInstance()]
    ]);

    private constructor() {
    }

    public static getInstance(): ParserAdapterFactory {
        return ParserAdapterFactory.INSTANCE;
    }

    public getAppropriateAdapter(protocolType: ProtocolType): IParserAdapter<IParsable> | undefined {
        return ParserAdapterFactory.ADAPTER_MAP.get(protocolType);
    }
}