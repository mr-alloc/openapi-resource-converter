import IParsable from "@/type/open-api/protocol/IParsable";

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