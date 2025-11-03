import {getPropOrDefault, getPropRecursive, Property} from "@/util/object-util";
import InType from "@/type/open-api/constant/in-type";
import DataType from "@/type/open-api/constant/data-type";
import DataFormat from "@/type/open-api/constant/data-format";
import Parameter from "@/type/open-api/sub/parameter";
import Parameters from "@/type/open-api/protocol/parameters";

export default class ParametersParser {

    private static readonly INSTANCE: ParametersParser = new ParametersParser();

    private readonly PROPERTY_NAME = "name";
    private readonly PROPERTY_IN = "in";
    private readonly PROPERTY_DESCRIPTION = "description";
    private readonly PROPERTY_REQUIRED = "required";
    private readonly PROPERTY_SCHEMA_TYPE = "schema.type";
    private readonly PROPERTY_SCHEMA_FORMAT = "schema.format;"

    private constructor() {
    }

    public static getInstance(): ParametersParser {
        return ParametersParser.INSTANCE;
    }

    public parse(property: Property | undefined): Parameters | undefined {
        if (!property) {
            return undefined;
        }
        const value = property.value;
        if (!Array.isArray(value) || value.length === 0) {
            return undefined;
        }

        const parameters = value.map(parameter => {
            return new Parameter(
                getPropOrDefault<string>(parameter, this.PROPERTY_NAME, ''),
                InType.fromValue(getPropOrDefault<string>(parameter, this.PROPERTY_IN, '')),
                getPropOrDefault<string>(parameter, this.PROPERTY_DESCRIPTION, ''),
                getPropOrDefault<boolean>(parameter, this.PROPERTY_REQUIRED, false),
                DataType.fromValue(getPropRecursive<string>(parameter, this.PROPERTY_SCHEMA_TYPE)),
                DataFormat.fromValue(getPropRecursive<string>(parameter, this.PROPERTY_SCHEMA_FORMAT))
            );
        });
        return new Parameters(parameters);
    }
}
