import DataType from "@/type/open-api/constant/DataType";

export default interface Field {
    get name(): string;
    get type(): DataType;
}