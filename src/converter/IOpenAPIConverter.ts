import OpenAPISpecification from "@/type/open-api/OpenAPISpecification";

export default interface IOpenAPIConverter<T> {

    convert(): T;
}