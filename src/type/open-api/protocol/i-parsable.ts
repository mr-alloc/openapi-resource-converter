import APISpecification from "@/type/open-api/APISpecification";

export default interface APISpecificationIParsable {

    toString(): string;

    needExtract(): boolean;
}