import PostmanConvertConfigures from "@/converter/postman/postman-convert-configures";
import CaseMode from "@/type/postman/constant/CaseMode";

export default class PostmanCommandBuilder {

    private readonly _configures: PostmanConvertConfigures;

    public  constructor() {
        this._configures = new PostmanConvertConfigures();
    }

    public applyFileOption(openapiJsonPath?: string) {
        return this;
    }

    public applyConfigOption(configYamlPath?: string) {
        return this;
    }
}