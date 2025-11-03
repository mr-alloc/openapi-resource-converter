import PostmanFormdata from "@/type/postman/postman-formdata";
import PostmanOptions from "@/type/postman/postman-options";
import RequestMode from "@/type/postman/constant/request-mode";
import IPostmanRequestBody from "@/type/postman/i-postman-request-body";
import {PostmanRequestBody} from "@/type/postman/postman-request-body";
import PostmanHeader from "@/type/postman/postman-header";

export default class PostmanBodyWrapper {

    private readonly _mode: string;
    private readonly _data: PostmanRequestBody;
    private readonly _options?: PostmanOptions;

    private constructor(mode: string, data: PostmanRequestBody, options?: PostmanOptions) {
        this._mode = mode
        this._data = data
        this._options = options
    }

    public toJSON() {
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
            if (typeof this._data === 'string') {
                wrapper.raw = this._data;
            } else {
                const rawBody = JSON.stringify(this._data);
                wrapper.raw = rawBody.replace(placeholderRE, "$1");
            }
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
