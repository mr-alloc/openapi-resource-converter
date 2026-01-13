import IPostmanNode from "@/type/postman/i-postman-node";
import Path from "@/type/path";
import PostmanRequest from "@/type/postman/postman-request";
import PostmanRequestWrapper from "@/type/postman/postman-request-wrapper";
import {PostmanEvent} from "@/type/postman/postman-event";

export default class PostmanDirectory implements IPostmanNode {
    private readonly _name: string;
    private readonly _path: Path;
    private readonly _item: Array<IPostmanNode>;

    constructor(name: string, path: string, item: Array<IPostmanNode>) {
        this._name = name
        this._path = new Path(path);
        this._item = item
    }

    get path(): Path {
        return this._path
    }

    get item(): Array<IPostmanNode> {
        return this._item
    }

    public includeDirectory(other: Path): boolean {
        return this._item.some(node => node.path.equals(other) && node instanceof PostmanDirectory);
    }

    public getDirectory(other: Path): PostmanDirectory {
        return this._item.find(node => node.path.equals(other)  && node instanceof PostmanDirectory) as PostmanDirectory;
    }

    public addNodeRecursive(path: Path, value: PostmanDirectory, depth: number) {
        if (path.isLastPath(depth)) {
            this._item.push(...value.item);
            return;
        }
        const current = path.subset(depth);

        //포함되지 않은 경로라면 추가
        if (current.equals(path) && !this.includeDirectory(current)) {
            this._item.push(value);
            return;
        }

        const directory = this.includeDirectory(current)
            ? this.getDirectory(current) : new PostmanDirectory(current.lastValue, current.value, [])

        //생성되지 않은 디렉터리라면
        if (!this.includeDirectory(current)) {
            this._item.push(directory);
        }

        directory.addNodeRecursive(path, value, depth +1);
    }

    public addRequest(
        name: string,
        postmanRequest: PostmanRequest,
        postmanEvent?: Array<PostmanEvent>
    ) {
        this._item.push(new PostmanRequestWrapper(name, postmanRequest, postmanEvent));
    }

    public toJSON() {
        return {
            name: this._name,
            item: this._item
        }
    }
}
