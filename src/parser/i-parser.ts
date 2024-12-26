import IParsable from "@/type/open-api/protocol/i-parsable";
import ProtocolType from "@/type/open-api/constant/protocol-type";
import IField from "@/type/open-api/sub/i-field";
import {Property} from "@/util/object-util";

export default interface IParser<T extends IParsable> {

    parse(metadata: Property, protocol: ProtocolType, components?: Map<string, any>): T;
}