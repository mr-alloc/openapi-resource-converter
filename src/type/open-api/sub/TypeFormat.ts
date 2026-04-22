import DataType from "@/type/open-api/constant/data-type";
import DataFormat from "@/type/open-api/constant/data-format";

export class TypeFormat {
    private readonly _type: DataType;
    private readonly _format: DataFormat;

    constructor(type: DataType, format: DataFormat) {
        this._type = type;
        this._format = format;
    }


}