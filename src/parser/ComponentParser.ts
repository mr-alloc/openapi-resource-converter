import NamedLiteral from "@/type/open-api/constant/NamedLiteral";

export default class ComponentParser {

    private static readonly COMPONENT_SCHEMAS_PATH = "components.schemas";
    private static instance: ComponentParser = new ComponentParser();

    private constructor() {
    }

    public static getInstance(): ComponentParser {
        return ComponentParser.instance;
    }

    parse(openApiJson: any): Map<string, any> {
        const paths = ComponentParser.COMPONENT_SCHEMAS_PATH.split(NamedLiteral.TOKEN_PATH_SEPARATOR) ?? [];
        const found = this.findNode(openApiJson, paths, 0);
        return Object.entries(found).reduce((accumulator, [key, value]) => {
            accumulator.set([NamedLiteral.HASH, ...paths, key].join("/"), value);
            return accumulator;
        }, new Map<string, any>());
    }

    findNode(tree: any, paths: Array<string>, index: number): any {
        const node = tree[paths[index]];
        if (paths.length -1 > index && node) {
            return this.findNode(node, paths, index + 1);
        }
        return node;
    }
}
