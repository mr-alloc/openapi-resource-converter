import RequestBody from "@/type/open-api/protocol/request-body";
import NamedLiteral from "@/type/open-api/constant/named-literal";
import ValueField from "@/type/open-api/sub/value-field";
import DataType from "@/type/open-api/constant/data-type";
import DataFormat from "@/type/open-api/constant/data-format";
import IField from "@/type/open-api/sub/i-field";
import ObjectField from "@/type/open-api/sub/object-field";
import {getDeepProp, getDeepProps, getProp, getPropOrDefault, hasDeepProp, hasProp, Property} from "@/util/object-util";
import EmptyBody from "@/type/open-api/protocol/empty-body";

export default class RequestBodyParser {
    private static INSTANCE: RequestBodyParser = new RequestBodyParser();
    private constructor() {}

    static getInstance(): RequestBodyParser {
        return RequestBodyParser.INSTANCE;
    }

    public parse(metadata: Property, components: Map<string, Array<IField>>): RequestBody | EmptyBody {
        const contentType = RequestBody.ALLOW_CONTENT_TYPES
            .find(contentType => hasDeepProp(metadata.value, ['content', contentType]));
        if (!contentType) {
            return new EmptyBody();
        }

        //schema 의 필드 값들
        const schemaProperties = getDeepProps(metadata.value, ['content', contentType, 'schema']);
        const hasReference = schemaProperties.some(prop => prop.name === NamedLiteral.REFERENCE_KEY);

        if (hasReference) {
            //schema 자체
            const property = getDeepProp(metadata.value, ['content', contentType, 'schema']);
            return new RequestBody(contentType, this.extractReferenceFields(property, components));
        }

        const properties = getDeepProps(metadata.value, ['content', contentType, 'schema', 'properties']);
        const fields = this.parseInternal(properties, components);
        return new RequestBody(contentType, fields);
    }

    private parseInternal(properties: Array<Property>, components: Map<string, Array<IField>>): Array<IField> {
        return properties.map(property => {
            if (hasProp(property.value, NamedLiteral.REFERENCE_KEY)) {
                const fields = this.extractReferenceFields(property, components);
                return new ObjectField(property.name, '', DataType.OBJECT, fields);
            }
            return InternalFieldParser.getInstance().parse(property.name, property.value);
        });
    }

    private extractReferenceFields (property: Property, components: Map<string, Array<IField>>): Array<IField> {
        const referenceKey = getProp<string>(property.value, NamedLiteral.REFERENCE_KEY);
        return components.get(referenceKey) ?? [];
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
