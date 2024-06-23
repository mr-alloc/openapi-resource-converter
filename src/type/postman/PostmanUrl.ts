import CollectionUtil from "@/util/CollectionUtil";

export default class PostmanUrl {

    private readonly raw: string
    private readonly protocol: string
    private readonly host: Array<string>
    private readonly path: Array<string>

    constructor(raw: string, protocol: string, host: Array<string>, path: Array<string>) {
        this.raw = raw
        this.protocol = protocol
        this.host = host
        this.path = path
    }

    getHost(): Array<string> {
        return this.host
    }

    getPath(): Array<string> {
        return this.path
    }

    static of(host: string, endPoint: string): PostmanUrl {
        return new PostmanUrl(
            `${host}${endPoint}`,
            '',
            [host],
            CollectionUtil.split(endPoint, '/')
        )
    }
}