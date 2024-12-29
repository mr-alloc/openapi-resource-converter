import ApiSpecification from "@/type/open-api/api-specification";

export default interface IParsable {

    toString(): string;

    needExtract(): boolean;
}
