import OpenAPISpecification from "@/type/open-api/OpenAPISpecification";
import {IConvertOutput} from "@/converter/constant/i-convert-output";

export default interface IOpenapiConverter {

    convert(): IConvertOutput;
}