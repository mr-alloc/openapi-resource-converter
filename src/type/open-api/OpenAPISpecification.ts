import Version from "@/type/open-api/sub/Version";
import ProjectInformation from "@/type/open-api/project/ProjectInformation";
import Tag from "@/type/open-api/sub/Tag";
import APISpecification from "@/type/open-api/APISpecification";

export default class  OpenAPISpecification {

    private readonly _version: Version;
    private readonly _info: ProjectInformation;
    private readonly _tags: Array<Tag>
    private readonly _specs: Array<APISpecification>;

    constructor(version: Version, info: ProjectInformation, tags: Array<Tag>, specs: Array<APISpecification>) {
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

    get specs(): Array<APISpecification> {
        return this._specs;
    }

    public toString() {

    }
}