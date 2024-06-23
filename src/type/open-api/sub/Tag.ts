export default class Tag {

        private readonly _description: string;
        private readonly _name: string;

        constructor(description: string, name: string) {
            this._description = description;
            this._name = name;
        }

        get description(): string {
            return this._description;
        }

        get name(): string {
            return this._name;
        }

        static fromJson(json: any) {
            return new Tag(json.name, json.description);
        }
}