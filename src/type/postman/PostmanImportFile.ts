import PostmanInfo from "@/type/postman/PostmanInfo";
import IPostmanNode from "@/type/postman/IPostmanNode";

export default class PostmanImportFile {
    private readonly _info: PostmanInfo;
    private readonly _nodes: Array<IPostmanNode>;

    constructor(info: PostmanInfo, item: Array<IPostmanNode>) {
        this._info = info
        this._nodes = item
    }

    get nodes(): Array<IPostmanNode> {
        return this._nodes
    }

    addNode(node: IPostmanNode) {
        this._nodes.push(node);
    }

    toJSON() {
        return {
            "info": this._info,
            "item": this._nodes
        }
    }
}