import OpenApiSpecification from "@/type/open-api/open-api-specification";
import {IConvertOutput} from "@/converter/constant/i-convert-output";

export default interface IOpenapiConverter {

    convert(): IConvertOutput;
}