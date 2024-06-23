import IPostmanNode from "@/type/postman/IPostmanNode";

export default class PostmanDirectory implements IPostmanNode {
    private readonly _name: string;
    private readonly _path: string;
    private readonly _item: Array<IPostmanNode>;

    constructor(name: string, path: string, item: Array<IPostmanNode>) {
        this._name = name
        this._path = path
        this._item = item
    }

    get path(): string {
        return this._path
    }

    get item(): Array<IPostmanNode> {
        return this._item
    }

    toJSON() {
        return {
            "name": this._name,
            "path": this._path,
            "item": this._item
        }
    }
}