import PostmanInfo from "@/type/postman/postman-info";
import IPostmanNode from "@/type/postman/i-postman-node";
import {IConvertOutput} from "@/converter/constant/i-convert-output";

export default class PostmanImportFile implements IConvertOutput{
    private readonly _info: PostmanInfo;
    private readonly _nodes: Array<IPostmanNode>;

    public constructor(info: PostmanInfo, item: Array<IPostmanNode>) {
        this._info = info
        this._nodes = item
    }

    public toJSON() {
        return {
            info: this._info,
            item: this._nodes
        }
    }
}
