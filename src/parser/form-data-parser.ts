import IParser from "@/parser/i-parser";
import Formdata from "@/type/open-api/protocol/formdata";
import Parameter from "@/type/open-api/sub/Parameter";
import DataType from "@/type/open-api/constant/data-type";
import DataFormat from "@/type/open-api/constant/data-format";
import InType from "@/type/open-api/constant/InType";
import ProtocolType from "@/type/open-api/constant/protocol-type";


export default class FormDataParser implements IParser<Formdata> {

    private static INSTANCE: FormDataParser = new FormDataParser();
    private constructor() {}

    public static getInstance(): FormDataParser {
        return FormDataParser.INSTANCE;
    }

    public checkPath(toBeParsed: any, tokenPath?: string): boolean {
        return true;
    }

    public getTokenPath(protocol: ProtocolType): string {
        //파라미터는 토큰패스가 없다. 따라서 한개의 빈 문자열을 반환한다. (최소 한번은 수행)
        return '';
    }

    parse(toBeParsed: any, tokenPath?: string): Formdata {
        if ( ! Array.isArray(toBeParsed)) {
            return new Formdata([]);
        }
        const parameterParser = InternalParameterParser.getInstance();
        const parameters = Array.from(toBeParsed)
            .map(parameterParser.parse);

        return new Formdata(parameters);
    }

}

class InternalParameterParser {

    private static readonly INSTANCE: InternalParameterParser = new InternalParameterParser();

    private static readonly PROPERTY_NAME = "name";
    private static readonly PROPERTY_IN = "in";
    private static readonly PROPERTY_DESCRIPTION = "description";
    private static readonly PROPERTY_REQUIRED = "required";

    private static readonly PROPERTY_SCHEMA = "schema";
    private static readonly PROPERTY_TYPE = "type";
    private static readonly PROPERTY_FORMAT = "format";


    private constructor() {}

    static getInstance(): InternalParameterParser {
        return InternalParameterParser.INSTANCE;
    }

    parse(parameter: any): Parameter {
        return new Parameter(
            parameter?.[InternalParameterParser.PROPERTY_NAME] ?? '',
            InType.fromValue(parameter?.[InternalParameterParser.PROPERTY_IN] ?? ''),
            parameter?.[InternalParameterParser.PROPERTY_DESCRIPTION] ?? '',
            parameter?.[InternalParameterParser.PROPERTY_REQUIRED] ?? false,
            DataType.fromValue(parameter?.[InternalParameterParser.PROPERTY_SCHEMA]?.[InternalParameterParser.PROPERTY_TYPE] ?? '') ,
            DataFormat.fromValue(parameter?.[InternalParameterParser.PROPERTY_SCHEMA]?.[InternalParameterParser.PROPERTY_FORMAT] ?? '')
        );
    }
}