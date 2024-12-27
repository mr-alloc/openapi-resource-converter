import IParsable from "@/type/open-api/protocol/i-parsable";

export default class EmptyBody implements IParsable {

    constructor() {
    }

    public toString() {
        return '(empty)';
    }

    needExtract(): boolean {
        return false;
    }
}