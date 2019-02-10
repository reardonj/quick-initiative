export class InitiativeEntry {
    constructor(
        readonly name: string, 
        readonly init: number,
        readonly id: number,
        readonly active: boolean) {}

    toggleActive(): InitiativeEntry {
        return new InitiativeEntry(this.name, this.init, this.id, !this.active);
    }
}