import IPostmanNode from "@/type/postman/i-postman-node";
import Path from "@/type/path";
import PostmanRequest from "@/type/postman/postman-request";
import PostmanRequestWrapper from "@/type/postman/postman-request-wrapper";

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
        const current = path.subset(depth);

        //마지막 경로일 경우에 만약 없다면 추가
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

    public addRequest(name: string, postmanRequest: PostmanRequest) {
        this._item.push(new PostmanRequestWrapper(name, postmanRequest));
    }

    public toJSON() {
        return {
            name: this._name,
            item: this._item
        }
    }
}
