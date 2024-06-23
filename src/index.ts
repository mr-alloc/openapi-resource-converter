import OpenApiParser from "@/parser/OpenApiParser";
import OpenAPIToPostmanImportFileConverter from "@/converter/postman/OpenAPIToPostmanImportFileConverter";
import PostmanConvertConfigures from "@/converter/postman/PostmanConvertConfigures";
import CaseMode from "@/type/postman/constant/CaseMode";
import {writeNewFile} from "@/util/FileUtil";
import * as readline from "node:readline";
import {program} from "commander";


const openAPISpecification = OpenApiParser.parse('./resources/openapi.json');
const configures = new PostmanConvertConfigures("{{url}}", CaseMode.SNAKE);
const converter = new OpenAPIToPostmanImportFileConverter(openAPISpecification, configures);

const path = `${process.cwd()}/static/postman.json`
writeNewFile(path, JSON.stringify(converter.convert(), null, 2));

const commandInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

program.version('1.0.0', '-v, --version')
    .name('orc')

program
    .command('orc <openapi-file-path> <output-file-path>')
    .usage('orc --openapi <openapi-file-path> --output <output-file-path>')
    .option('-f, --openapi <openapi-file-path>', 'openapi file path')
    .option('-o, --output <output-file-path>', 'output file path')
    .action((openapiFilePath: string, outputFilePath: string) => {
        const openAPISpecification = OpenApiParser.parse(openapiFilePath);
        const configures = new PostmanConvertConfigures("{{url}}", CaseMode.SNAKE);
        const converter = new OpenAPIToPostmanImportFileConverter(openAPISpecification, configures);

        writeNewFile(outputFilePath, JSON.stringify(converter.convert(), null, 2));
        console.log(`Convert Success! ${outputFilePath}`);
        commandInterface.close();
    });

program
    .command('*', {hidden: true})
    .action(() => {
        console.log('Invalid command');
        program.help();
    })

program.parse(process.argv);

