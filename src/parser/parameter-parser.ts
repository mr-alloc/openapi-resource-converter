import Parameter from "@/type/open-api/sub/Parameter";
import {getPropOrDefault, getPropRecursive} from "@/util/object-util";
import InType from "@/type/open-api/constant/in-type";
import DataType from "@/type/open-api/constant/data-type";
import DataFormat from "@/type/open-api/constant/data-format";

export default class ParameterParser {

    private static readonly INSTANCE: ParameterParser = new ParameterParser();

    private readonly PROPERTY_NAME = "name";
    private readonly PROPERTY_IN = "in";
    private readonly PROPERTY_DESCRIPTION = "description";
    private readonly PROPERTY_REQUIRED = "required";

    private constructor() {}

    static getInstance(): ParameterParser {
        return ParameterParser.INSTANCE;
    }

    public parse(parameter: any): Parameter {
        return new Parameter(
            getPropOrDefault<string>(parameter, this.PROPERTY_NAME, ''),
            InType.fromValue(getPropOrDefault<string>(parameter, this.PROPERTY_IN, '')),
            getPropOrDefault<string>(parameter, this.PROPERTY_DESCRIPTION, ''),
            getPropOrDefault<boolean>(parameter, this.PROPERTY_REQUIRED, false),
            DataType.fromValue(getPropRecursive<string>(parameter, 'schema.type')),
            DataFormat.fromValue(getPropRecursive<string>(parameter, 'schema.format'))
        );
    }
}