#!/usr/bin/env node
import 'module-alias/register';
import {Command} from "commander";
import PostmanCommandBuilder from "@/converter/postman/postman-command-builder";
import {CommandOption} from "@/types";

const postmanFilePath = '/static/postman.json';
const openApiFilePath = '/resources/openapi.json';
// const json = readFile(`${currentPath}${postmanFilePath}`);

const program = new Command();
program
    .name('orc')
    .description('OpenAPI Resource Converter')
    .option('-h, --help', '도움말 표시');

program
    .command('postman')
    .description('convert openapi to postman')
    .option('-f, --file <openapi-file-path>', 'openapi.json 파일 경로(openapi.json file path)')
    .option('-o, --output <output-file-path>', '변환된 파일 저장 경로.(to be saved output file path)')
    .option('-l, --lint', '설정파일을 검증합니다.(validate the configuration file)', false)
    .option('-c, --config <config-file-path>', '설정파일 경로 지정 (set the configuration yaml file path)')
    .action((option: CommandOption) => {
        try {
            const commandBuilder = new PostmanCommandBuilder(option);
            commandBuilder.execute();
        } catch (error) {
            console.error('Error Occurred with command postman:', error)
            process.exit(1);
        }
    });



program.parse(process.argv);
