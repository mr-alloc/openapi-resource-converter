import PostmanFormData from "@/type/postman/PostmanFormData";
import PostmanOptions from "@/type/postman/PostmanOptions";
import RequestMode from "@/type/postman/constant/RequestMode";
import IPostmanRequestBody from "@/type/postman/IPostmanRequestBody";
import {PostmanRequestBody} from "@/type/postman/PostmanRequestBody";

export default class PostmanBodyWrapper {

    private readonly _mode: string;
    private readonly _data: PostmanRequestBody;
    private readonly _options?: PostmanOptions;

    private constructor(mode: string, data: PostmanRequestBody, options?: PostmanOptions) {
        this._mode = mode
        this._data = data
        this._options = options
    }

    toJSON() {
        const wrapper = {
            mode: this._mode
        } as unknown as {
            mode: string,
            options: PostmanOptions,
            formdata?: Array<PostmanFormData>,
            raw?: string
        }
        if (Array.isArray(this._data)) {
            wrapper.formdata = this._data;
        } else {
            const placeholderRE = /\"(\{\{[\w_]+\}\})\"/gm;
            const rawBody = JSON.stringify(this._data);
            wrapper.raw = rawBody.replace(placeholderRE, "$1");
            wrapper.options = this._options!;
        }
        return wrapper;
    }

    static fromFormData(data: Array<PostmanFormData>) {
        return new PostmanBodyWrapper(RequestMode.FORMDATA.value, data);
    }

    static fromRaw(data: IPostmanRequestBody) {
        return new PostmanBodyWrapper(RequestMode.RAW.value, data, PostmanOptions.of("json"));
    }

    static fromEmpty(data: IPostmanRequestBody) {
        return new PostmanBodyWrapper(RequestMode.RAW.value, data, PostmanOptions.of("json"));
    }
}