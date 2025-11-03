export default class Version {

    private readonly _major: number;
    private readonly _minor: number;
    private readonly _patch: number;

    constructor(major: number, minor: number, patch: number) {
        this._major = major;
        this._minor = minor;
        this._patch = patch;
    }

    get major(): number {
        return this._major;
    }

    get minor(): number {
        return this._minor;
    }

    get patch(): number {
        return this._patch;
    }

    isEqual(version: Version): boolean {
        return this._major === version.major && this._minor === version.minor && this._patch === version.patch;
    }

    isGreaterThan(version: Version): boolean {
        return this._major > version.major
            || (this._major === version.major && this._minor > version.minor)
            || (this._major === version.major && this._minor === version.minor && this._patch > version.patch);
    }

    isLessThan(version: Version): boolean {
        return this._major < version.major
            || (this._major === version.major && this._minor < version.minor)
            || (this._major === version.major && this._minor === version.minor && this._patch < version.patch);
    }

    static parse(version: string): Version {
        const versionParts = version.split(".");
        if (versionParts.length !== 3) {
            throw new Error("Invalid version format");
        }
        return new Version(parseInt(versionParts[0]), parseInt(versionParts[1]), parseInt(versionParts[2]));
    }

}