import IParser from "@/parser/i-parser";
import RequestBody from "@/type/open-api/protocol/request-body";
import NamedLiteral from "@/type/open-api/constant/named-literal";
import ValueField from "@/type/open-api/sub/value-field";
import DataType from "@/type/open-api/constant/data-type";
import DataFormat from "@/type/open-api/constant/data-format";
import IField from "@/type/open-api/sub/i-field";
import ObjectField from "@/type/open-api/sub/object-field";
import ProtocolType from "@/type/open-api/constant/protocol-type";
import {getProp, getPropOrDefault, getProps, hasProp, Property} from "@/util/object-util";

export default class RequestBodyParser implements IParser<RequestBody> {

    private static readonly CONTENT_TYPE = "application/json"
    private static INSTANCE: RequestBodyParser = new RequestBodyParser();
    private constructor() {}

    static getInstance(): RequestBodyParser {
        return RequestBodyParser.INSTANCE;
    }

    public parse(metadata: Property, protocol: ProtocolType, components: Map<string, Array<IField>>): RequestBody {
        const contentType = RequestBody.findContentType(protocol);

        const properties = getProps(metadata.value, ['content', contentType, 'schema', 'properties']);
        const fields = this.parseInternal(properties, components);
        return new RequestBody(contentType, fields);
    }

    private parseInternal(properties: Array<Property>, components: Map<string, Array<IField>>): Array<IField> {
        return properties.map(property => {
            if (hasProp(property.value, NamedLiteral.REFERENCE_KEY)) {
                const referenceKey = getProp<string>(property.value, NamedLiteral.REFERENCE_KEY);
                const fields = components.get(referenceKey) ?? [];
                return new ObjectField(property.name, '', DataType.OBJECT, fields);
            }
            return InternalFieldParser.getInstance().parse(property.name, property.value);
        });
    }

}

class InternalFieldParser {

    private static readonly INSTANCE: InternalFieldParser = new InternalFieldParser();

    private readonly PROPERTY_DESCRIPTION = "description";
    private readonly PROPERTY_TYPE = "type";
    private readonly PROPERTY_FORMAT = "format";
    private readonly PROPERTY_EXAMPLE = "example";

    private constructor() {}

    static getInstance(): InternalFieldParser {
        return InternalFieldParser.INSTANCE;
    }

    public parse(name: string, property: any): ValueField {
        return new ValueField(
            name,
            getPropOrDefault<string>(property, this.PROPERTY_DESCRIPTION, ''),
            DataType.fromValue(getProp<string>(property, this.PROPERTY_TYPE)),
            DataFormat.fromValue(getProp<string>(property, this.PROPERTY_FORMAT)),
            '',
            getPropOrDefault<string>(property, this.PROPERTY_EXAMPLE, '')
        );
    }
}
