import PostmanConvertConfigures from "@/converter/postman/postman-convert-configures";
import CaseMode from "@/type/postman/constant/CaseMode";
import OpenApiSpecification from "@/type/open-api/open-api-specification";
import OpenApiParser from "@/parser/open-api-parser";
import {isEmpty} from "@/util/string-util";
import {notExist, readFile, refreshFile} from "@/util/file-util";
import PostmanConfigParser from "@/parser/postman-config-parser";
import {CommandOption} from "@/types";
import PostmanCollectionConverter from "@/converter/postman/postman-collection-converter";

export default class PostmanCommandBuilder {

    private readonly _configures: PostmanConvertConfigures;
    private readonly _option: CommandOption;

    private _existConfig: boolean = false;

    public constructor(option: CommandOption) {
        this._configures = new PostmanConvertConfigures();
        this._option = option

        this.applyConfigOption();
        if (option.lint === true) {
            console.log('Lint Mode')
            return;
        }
        this.applyFileOption();
        this.applyOutputOption();
    }

    private applyFileOption() {
        const openapiJsonPath = this._option.file;
        if (isEmpty(openapiJsonPath)) {
            throw new Error('File Path is Empty');
        }

        if (notExist(openapiJsonPath!)) {
            throw new Error('Invalid file path:'+ openapiJsonPath)
        }
        return this;
    }

    private applyConfigOption() {
        const configYamlPath = this._option.config;
        if (isEmpty(configYamlPath)) {
            return;
        }

        if (notExist(configYamlPath!)) {
            throw new Error('Invalid config file path:'+ configYamlPath);
        }

        this._existConfig = true;
        return this;
    }

    private applyOutputOption() {
        const outputJsonPath = this._option.output;
        if (isEmpty(outputJsonPath)) {
            throw new Error('File Path is Empty');
        }

        return this;
    }

    public execute() {
        if ( ! this._existConfig) {
            return;
        }

        const yaml = readFile(this._option.config!);
        const configParser = new PostmanConfigParser();
        const parsedPostmanOption = configParser.parse(yaml);

        if (this._option.lint === true) {
            parsedPostmanOption.printStatus();
            return;
        }

        this._configures.applyPostmanOption(parsedPostmanOption);

        const openApiParser = new OpenApiParser(this._option.file!);
        const openAPI = openApiParser.parse();

        const converter = new PostmanCollectionConverter(openAPI, this._configures);

        const output = converter.convert();
        refreshFile(this._option.output!, JSON.stringify(output));
    }
}