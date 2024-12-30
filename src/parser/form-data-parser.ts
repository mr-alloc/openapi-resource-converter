import IParser from "@/parser/i-parser";
import Parameters from "@/type/open-api/protocol/parameters";
import ProtocolType from "@/type/open-api/constant/protocol-type";
import {Property} from "@/util/object-util";
import ParameterParser from "@/parser/parameter-parser";


export default class FormDataParser implements IParser<Parameters> {

    private static INSTANCE: FormDataParser = new FormDataParser();
    private constructor() {}

    public static getInstance(): FormDataParser {
        return FormDataParser.INSTANCE;
    }

    public parse(metadata: Property, protocol: ProtocolType): Parameters {
        const parameterParser = ParameterParser.getInstance();

        const parameters = Array.from(metadata.value)
            .map(param => parameterParser.parse(param));

        return new Parameters(parameters);
    }

}

