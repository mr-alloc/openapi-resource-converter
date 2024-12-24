import {readFile} from "@/util/file-util";
import {Command} from "commander";
import ComponentParser from "@/parser/component-parser";

const currentPath = process.cwd();
const postmanFilePath = '/static/postman.json';
const openApiFilePath = '/resources/openapi.json';
// const json = readFile(`${currentPath}${postmanFilePath}`);

const program = new Command();

program
    .name("orc")
    .command('orc')
    .description('Simple Open API Specification Converter')
    .version('1.0.0')
    .option('-o, --component', 'Convert only components')
    .action((options) => {
        const file = readFile(`${currentPath}${openApiFilePath}`);
        const json = JSON.parse(file);

        const map = new ComponentParser(json.components).parse();
        console.log('total components:', map.size);
    });

program.parse();
