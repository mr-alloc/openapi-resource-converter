import HttpMethod from "@/type/open-api/constant/http-method";
import Path from "@/type/path";
import Parameters from "@/type/open-api/protocol/parameters";
import RequestBody from "@/type/open-api/protocol/request-body";
import {getProp} from "@/util/object-util";
import NamedLiteral from "@/type/open-api/constant/named-literal";
import EmptyBody from "@/type/open-api/protocol/empty-body";
import OpenApiRequest from "@/type/open-api/protocol/open-api-request";

export default class ApiSpecification {

    private readonly _method: HttpMethod;
    private readonly _path: Path;
    private readonly _tags: Array<string>;
    private readonly _summary: string;
    private readonly _operationId: string;
    private readonly _requestBody: RequestBody | EmptyBody
    private readonly _parameters?: Parameters;

    public constructor(
        request: OpenApiRequest,
        requestBody: RequestBody | EmptyBody,
        parameters?: Parameters,
    ) {
        const self = request.metadata;
        this._method = request.method;
        this._path = new Path(request.path);
        this._tags = getProp<Array<string>>(self.value, NamedLiteral.TAGS);
        this._summary = getProp<string>(self.value, NamedLiteral.SUMMARY);
        this._operationId = getProp<string>(self.value, NamedLiteral.OPERATION_ID);
        this._requestBody = requestBody;
        this._parameters = parameters;
    }

    get method(): HttpMethod {
        return this._method;
    }

    get path(): Path {
        return this._path;
    }

    get tags(): Array<string> {
        return this._tags;
    }

    get summary(): string {
        return this._summary;
    }

    get operationId(): string {
        return this._operationId;
    }

    get requestBody(): RequestBody | EmptyBody {
        return this._requestBody;
    }

    get hasParameters(): boolean {
        return this._parameters !== undefined;
    }

    get parameters(): Parameters | undefined {
        return this._parameters;
    }
}
