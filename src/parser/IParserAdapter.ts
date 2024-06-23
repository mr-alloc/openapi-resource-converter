import IParsable from "@/type/open-api/protocol/IParsable";
import ProtocolType from "@/type/open-api/constant/ProtocolType";
import Field from "@/type/open-api/sub/Field";

export default interface IParserAdapter<T extends IParsable> {

    getTokenPath(): Array<string>;

    checkPath(toBeParsed: any, tokenPath?: string): boolean;

    parse(toBeParsed: any, tokenPath?: string, components?: Map<string, any>): T;
}