import PostmanFormdata from "@/type/postman/postman-formdata";
import PostmanOptions from "@/type/postman/postman-options";
import RequestMode from "@/type/postman/constant/RequestMode";
import IPostmanRequestBody from "@/type/postman/i-postman-request-body";
import {PostmanRequestBody} from "@/type/postman/postman-request-body";
import PostmanHeader from "@/type/postman/postman-header";

export default class PostmanBodyWrapper {

    private readonly _mode: string;
    private readonly _data: PostmanRequestBody;
    private readonly _options?: PostmanOptions;
    private _headers: Array<PostmanHeader> = [];

    private constructor(mode: string, data: PostmanRequestBody, options?: PostmanOptions) {
        this._mode = mode
        this._data = data
        this._options = options
    }

    set headers(value: Array<PostmanHeader>) {
        this._headers = value;
    }

    get headers(): Array<PostmanHeader> {
        return this._headers;
    }

    toJSON() {
        const wrapper = {
            mode: this._mode
        } as unknown as {
            mode: string,
            options: PostmanOptions,
            formdata?: Array<PostmanFormdata>,
            raw?: string
        }
        if (Array.isArray(this._data)) {
            wrapper.formdata = this._data;
        } else {
            const placeholderRE = /\"(\{\{[\w_]+\}\})\"/gm;
            wrapper.raw = this._data as string;
            wrapper.options = this._options!;
        }
        return wrapper;
    }

    static fromFormData(data: Array<PostmanFormdata>) {
        return new PostmanBodyWrapper(RequestMode.FORMDATA.value, data);
    }

    static fromRaw(data: IPostmanRequestBody) {
        return new PostmanBodyWrapper(RequestMode.RAW.value, data, PostmanOptions.of("json"));
    }

    static fromEmpty(data: IPostmanRequestBody) {
        return new PostmanBodyWrapper(RequestMode.RAW.value, data, PostmanOptions.of("json"));
    }
}