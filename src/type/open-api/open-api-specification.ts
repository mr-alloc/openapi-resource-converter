import ProjectInformation from "@/type/open-api/project/project-information";
import Tag from "@/type/open-api/sub/tag";
import ApiSpecification from "@/type/open-api/api-specification";
import Version from "@/type/open-api/sub/version";

export default class OpenApiSpecification {

    private readonly _version: Version;
    private readonly _info: ProjectInformation;
    private readonly _tags: Array<Tag>
    private readonly _specs: Array<ApiSpecification>;

    constructor(version: Version, info: ProjectInformation, tags: Array<Tag>, specs: Array<ApiSpecification>) {
        this._version = version;
        this._info = info;
        this._tags = tags;
        this._specs = specs;
    }

    get version(): Version {
        return this._version;
    }

    get info(): ProjectInformation {
        return this._info;
    }

    get tags(): Array<Tag> {
        return this._tags;
    }

    get specs(): Array<ApiSpecification> {
        return this._specs;
    }

    public toString() {

    }
}