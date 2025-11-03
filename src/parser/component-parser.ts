import NamedLiteral from "@/type/open-api/constant/named-literal";
import IField from "@/type/open-api/sub/i-field";
import {getProp, getDeepProps, hasProp, Property, toProps} from "@/util/object-util";
import {toMap, toValueMap} from "@/util/collection-util";
import DataType from "@/type/open-api/constant/data-type";
import ValueField from "@/type/open-api/sub/value-field";
import ObjectField from "@/type/open-api/sub/object-field";

export default class ComponentParser {

    private readonly SCHEMAS_PATH = "schemas";
    private readonly COMPONENTS_KEY_PREFIX = "#/components/schemas/";
    private readonly _properties: Array<Property>;
    private readonly _rootProperty: Map<string, Property>;
    private readonly _cache: Map<string, Array<IField>>;

    public constructor(components: any) {
        this._properties = getDeepProps(components, [this.SCHEMAS_PATH]);
        this._rootProperty = toMap<Property, string>(
            this._properties,
            (prop) => this.COMPONENTS_KEY_PREFIX + prop.name
        );
        this._cache = new Map<string, Array<IField>>();
    }

    //컴포넌트는 요청의 일부로서 사용되기 때문에 properties 만 파싱하면 된다.
    public parse(): Map<string, Array<IField>> {
        //컴포넌트는 파싱하는 과정에서다른 컴포넌트를 참조할 수 있기 때문에 찾으면서, 트리형태로 만들어가는 구조를 가진다.
        //따라서 properties.{param_name}.$ref 가 있다면 해당 값으로 먼저 파싱된 객체가 있는지를 확인하고, 없다면 만들어서 캐시한다.
        for (const property of this._properties) {
            //각 스키마별로 파싱한다.
            this.parseSchema(property);
        }

        return this._cache;
    }

    private parseSchema(property: Property) {
        //아직 object type 외에는 존재하지 않는다.
        if (DataType.OBJECT.equalsValue(getProp<string>(property.value, NamedLiteral.TYPE))) {
            const referenceKey = hasProp(property.value, NamedLiteral.REFERENCE_KEY)
                ? getProp<string>(property.value, NamedLiteral.REFERENCE_KEY)
                : this.COMPONENTS_KEY_PREFIX + property.name;
            this.retrieveCacheRecursively(referenceKey)
        }
    }

    private retrieveCacheRecursively(referenceKey: string): Array<IField> {
        if (this._cache.has(referenceKey)) {
            return this._cache.get(referenceKey)!;
        }

        const parent = this._rootProperty.get(referenceKey)!;
        const properties = getDeepProps(parent.value, [NamedLiteral.PROPERTIES]);
        const fields = new Array<IField>();

        for (const property of properties) {
            if (hasProp(property.value, NamedLiteral.REFERENCE_KEY)) {
                const referenceKey = getProp<string>(property.value, NamedLiteral.REFERENCE_KEY);
                const cached = this.retrieveCacheRecursively(referenceKey);
                fields.push(new ObjectField(property.name, '', DataType.OBJECT, cached));
            } else {
                fields.push(ValueField.fromProperty(property));
            }
        }
        this._cache.set(referenceKey, fields);
        return fields;
    }
}
