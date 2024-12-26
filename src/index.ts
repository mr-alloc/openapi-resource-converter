import {readFile} from "@/util/file-util";
import {Command} from "commander";
import ComponentParser from "@/parser/component-parser";
import PostmanCommandBuilder from "@/converter/postman/postman-command-builder";

const postmanFilePath = '/static/postman.json';
const openApiFilePath = '/resources/openapi.json';
// const json = readFile(`${currentPath}${postmanFilePath}`);

const program = new Command();
program
    .name('orc')
    .description('OpenAPI Resource Converter')
    .option('-h, --help', '도움말 표시');


program
    .command('component')
    .description('only convert openapi.components')
    .action((options) => {
        const file = readFile(openApiFilePath);
        const json = JSON.parse(file);

        const map = new ComponentParser(json.components).parse();
    });

program
    .command('postman')
    .description('convert openapi to postman')
    .requiredOption('-f, --file <openapi-file-path>', 'openapi.json 파일 경로는 필수입니다.(this file path is required)')
    .option('-c, --config <config-file-path>', '설정파일 경로 지정 (set the configuration yaml file path)')
    .action((options: CommandOption) => {
        try {
            const commandBuilder = new PostmanCommandBuilder()
                .applyFileOption(options.file)
                .applyConfigOption(options.config);

            // const openApiParser = new OpenApiParser('/resources/openapi.json', 'utf-8');
            // const specification = openApiParser.parse();
            //
            // const configuration = new PostmanConvertConfiguration('{{url}}', CaseMode.SNAKE);
            // const converter = new PostmanCollectionConverter(specification, configuration);
            //
            // const output = converter.convert();
            // refreshFile(postmanFilePath, JSON.stringify(output));
        } catch (error) {
            console.error('Error Occurred with postman-convert:', error)
            process.exit(1);
        }
    });

program.parse(process.argv);
