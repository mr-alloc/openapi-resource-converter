import ApiSpecification from "@/type/open-api/api-specification";

export default interface APISpecificationIParsable {

    toString(): string;

    needExtract(): boolean;
}