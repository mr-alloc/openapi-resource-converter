#!/usr/bin/env node
import 'module-alias/register';
import 'source-map-support/register'
import {Command} from "commander";
import PostmanCommandBuilder from "@/converter/postman/postman-command-builder";
import {CommandOption} from "@/types";
import packageJson from 'package.json';

const program = new Command();
program
    .name('orc')
    .description('OpenAPI Resource Converter')
    .version(packageJson.version)

program
    .command('postman')
    .description('convert openapi to postman')
    .option('-f, --file <openapi-file-path>', 'openapi.json 파일 경로(openapi.json file path)')
    .option('-o, --output <output-file-path>', '변환된 파일 저장 경로(to be saved output file path)')
    .option('-c, --config <config-file-path>', '설정파일 경로 지정 (set the configuration yaml file path)')
    .option('-l, --lint', '설정 파일을 검증(validate the configuration file)', false)
    .action((option: CommandOption) => {
        try {
            const commandBuilder = new PostmanCommandBuilder(option);
            commandBuilder.execute();
        } catch (error) {
            console.error('Error Occurred with command postman:', error)
            process.exit(1);
        }
    })
    .addHelpText('after', `
    Examples:
        $ orc postman -f./openapi.json -o ./collection.json
        $ orc postman -f ./api.json -o ./output.json -c ./config.yaml
        $ orc postman -l -c ./config.yaml
    `);



program.parse(process.argv);
