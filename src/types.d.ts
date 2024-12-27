import Path from "@/type/path";
import HttpMethod from "@/type/open-api/constant/http-method";
import IPostmanRequestBody from "@/type/postman/i-postman-request-body";

export type CommandOption = {
    file?: string,
    config?: string,
    output?: string,
    lint?: boolean
}

export type PostmanRequestWrapperFunction = (path: Path, method: HttpMethod, body: IPostmanRequestBody) => IPostmanRequestBody

