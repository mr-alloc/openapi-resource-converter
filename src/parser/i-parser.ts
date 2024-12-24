import IParsable from "@/type/open-api/protocol/i-parsable";
import ProtocolType from "@/type/open-api/constant/protocol-type";
import IField from "@/type/open-api/sub/i-field";

export default interface IParser<T extends IParsable> {

    getTokenPath(protocol: ProtocolType): string;

    checkPath(toBeParsed: any, tokenPath?: string): boolean;

    parse(toBeParsed: any, tokenPath?: string, components?: Map<string, any>): T;
}