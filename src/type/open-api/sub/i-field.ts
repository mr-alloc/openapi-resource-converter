import DataType from "@/type/open-api/constant/data-type";

export default interface IField {

    get name(): string;
    get type(): DataType;

}