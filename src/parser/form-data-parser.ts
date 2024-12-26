import IParser from "@/parser/i-parser";
import Formdata from "@/type/open-api/protocol/formdata";
import ProtocolType from "@/type/open-api/constant/protocol-type";
import {Property} from "@/util/object-util";
import ParameterParser from "@/parser/parameter-parser";


export default class FormDataParser implements IParser<Formdata> {

    private static INSTANCE: FormDataParser = new FormDataParser();
    private constructor() {}

    public static getInstance(): FormDataParser {
        return FormDataParser.INSTANCE;
    }

    public parse(metadata: Property, protocol: ProtocolType): Formdata {
        const parameterParser = ParameterParser.getInstance();

        const parameters = Array.from(metadata.value)
            .map(param => parameterParser.parse(param));

        return new Formdata(parameters);
    }

}

