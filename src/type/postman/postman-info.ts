export default class PostmanInfo {
    private readonly _postmanId: string;
    private readonly _name: string;
    private readonly _schema: string;
    private readonly _exporterId: string;

    constructor(postmanId: string, name: string, schema: string, exporterId: string) {
        this._postmanId = postmanId
        this._name = name
        this._schema = schema
        this._exporterId = exporterId
    }

    get postmanId() {
        return this._postmanId
    }

    get name() {
        return this._name
    }

    get schema() {
        return this._schema
    }

    get exporterId() {
        return this._exporterId
    }

    /**
     * For Serialize
     */
    toJSON() {
        return {
            "_postman_id": this._postmanId,
            "name": this._name,
            "schema": this._schema,
            "_exporter_id": this._exporterId
        }
    }
}