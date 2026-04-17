import NamedLiteral from "@/type/open-api/constant/named-literal";
import IField from "@/type/open-api/sub/i-field";
import {getArrayProp, getDeepProps, getProp, getPropOrDefault, hasProp, Property} from "@/util/object-util";
import {toMap} from "@/util/collection-util";
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
            this.parseComponentObject(property, {cache: true, superClass: false});
        }

        return this._cache;
    }

    private ensureComponentName(name: string): string {
        return name.startsWith(this.COMPONENTS_KEY_PREFIX) ? name : this.COMPONENTS_KEY_PREFIX + name;
    }

    //Schema에는 하위 항목들이 들어갈 수 있음.
    //공통 (description: 설명)
    //$ref: 참조되는 객체 타입
    //allOf: 해당 타입들을 포함하는 모든 정보
    //oneOf: 이들 중 한개의 타입을 포함하는 모든 정보
    //type: 위 정보들이 아닌 객체 및 값을 타입

    private parseComponentObject(component: Property, option: ParseOption = {
        cache: true,
        superClass: false
    }): Array<IField> {
        if (option.cache && this._cache.has(this.ensureComponentName(component.name))) {
            return this._cache.get(this.ensureComponentName(component.name))!;
        }
        const fields = new Array<IField>();
        const hasType = hasProp(component?.value, NamedLiteral.TYPE);

        if (hasType) {
            if (DataType.OBJECT.equalsValue(getProp(component?.value, NamedLiteral.TYPE))) {
                const objectFields = new Array<IField>();
                for (const property of getDeepProps(component.value, [NamedLiteral.PROPERTIES])) {
                    const propertyFields = this.parseComponentObject(property, {
                        cache: false,
                        superClass: option.superClass
                    });

                    const hasOneOf = hasProp(property.value, NamedLiteral.ONE_OF);
                    const hasAllOf = hasProp(property.value, NamedLiteral.ALL_OF);
                    const isObject = DataType.OBJECT.equalsValue(getProp(property.value, NamedLiteral.TYPE));

                    const wrappedFields = (isObject || hasOneOf || hasAllOf)
                        ? [new ObjectField(property.name, getPropOrDefault(property.value, NamedLiteral.DESCRIPTION, ''), DataType.OBJECT, propertyFields, false)]
                        : propertyFields;
                    objectFields.push(...wrappedFields);
                }
                fields.push(...objectFields);
            } else {
                fields.push(ValueField.fromProperty(component, option.superClass));
            }
        } else if (hasProp(component.value, NamedLiteral.ALL_OF)) {
            const allOfArray = getArrayProp<any>(component.value, NamedLiteral.ALL_OF);
            const referenceKey = getProp<string>(allOfArray[0], NamedLiteral.REFERENCE_KEY);

            fields.push(...this.parseComponentObject(this._rootProperty.get(referenceKey)!, {
                cache: true,
                superClass: true
            }));
            if (allOfArray.length > 1) {
                fields.push(...this.parseComponentObject(new Property("", allOfArray[1]), {
                    cache: false,
                    superClass: false
                }));
            }
        } else if (hasProp(component.value, NamedLiteral.ONE_OF)) {
            //요청 생성에는 최상위 공통정보만 사용하지만, 파싱할 때는, 모든 정보를 저장한다.
            const oneOfArray = getArrayProp<any>(component.value, NamedLiteral.ONE_OF);
            const superClassFields = new Array<IField>();
            for (const element of oneOfArray) {
                const allFields = this.parseComponentObject(new Property("", element), {
                    cache: false,
                    superClass: false
                });
                if (superClassFields.length === 0) {
                    //allFields에 있는 구현체 한개(object)를 찾아서, super class field만 가져오기
                    const implementation = allFields.find(field => DataType.OBJECT.equalsValue(field.type.value));
                    if (implementation) {
                        const foundFields = (implementation as ObjectField).fields.filter(field => field.isSuperClass);
                        superClassFields.push(...foundFields);
                    }
                }
            }
            fields.push(...superClassFields);
        } else if (hasProp(component.value, NamedLiteral.REFERENCE_KEY)) {
            const property = this._rootProperty.get(getProp<string>(component.value, NamedLiteral.REFERENCE_KEY))!;
            const referenceFields = this.parseComponentObject(property);
            //ref는 필드명으로 넣는다.
            fields.push(new ObjectField(component.name, getPropOrDefault(property.value, NamedLiteral.DESCRIPTION, ''), DataType.OBJECT, referenceFields, false));
        }
        if (option.cache) {
            this._cache.set(this.ensureComponentName(component.name), fields);
        }
        return fields;
    }
}

type ParseOption = {
    cache: boolean; //컴포넌트 캐시 여부
    superClass: boolean; //부모 클래스에서 선언된 필드 여부
}
