import OpenApiParser from "@/parser/OpenApiParser";
import OpenAPIToPostmanImportFileConverter from "@/converter/postman/OpenAPIToPostmanImportFileConverter";
import PostmanConvertConfigures from "@/converter/postman/PostmanConvertConfigures";
import CaseMode from "@/type/postman/constant/CaseMode";
import {writeNewFile} from "@/util/FileUtil";


const openAPISpecification = OpenApiParser.parse('./resources/openapi.json');
const configures = new PostmanConvertConfigures("{{url}}", CaseMode.CAMEL);
const converter = new OpenAPIToPostmanImportFileConverter(openAPISpecification, configures);

const path = `${process.cwd()}/static/postman.json`
const converted = converter.convert();
writeNewFile(path, JSON.stringify(converted, null, 2));


