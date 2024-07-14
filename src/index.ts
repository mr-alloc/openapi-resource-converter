import OpenApiParser from "@/parser/OpenApiParser";
import OpenAPIToPostmanImportFileConverter from "@/converter/postman/OpenAPIToPostmanImportFileConverter";
import PostmanConvertConfigures from "@/converter/postman/PostmanConvertConfigures";
import {writeNewFile} from "@/util/FileUtil";
import IPostmanRequestBody from "@/type/postman/IPostmanRequestBody";
import CaseMode from "@/type/postman/constant/CaseMode";


const openAPISpecification = OpenApiParser.parse('./resources/openapi.json');
const configures = new PostmanConvertConfigures("{{url}}", CaseMode.SNAKE);
configures.addPlaceholders(new Map<string, any>([
    ['email', 'custom_email'],
]))
const converter = new OpenAPIToPostmanImportFileConverter(openAPISpecification, configures);

const path = `${process.cwd()}/static/postman.json`
const converted = converter.convert();
writeNewFile(path, JSON.stringify(converted, null, 2));


