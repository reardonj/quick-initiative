export class InitiativeEntry {
    constructor(
        readonly name: string,
        readonly init: number,
        readonly id: number,
        readonly active: boolean,
        readonly canMoveDown: boolean,
        readonly canMoveUp: boolean) { }

    updateActive(isActive: boolean): InitiativeEntry {
        return new InitiativeEntry(this.name, this.init, this.id, isActive, this.canMoveDown, this.canMoveUp);
    }

    updateMovement(index: number, totalItems: number): InitiativeEntry {
        const canMoveDown = index < totalItems - 1;
        const canMoveUp = index > 0;
        return new InitiativeEntry(this.name, this.init, this.id, this.active, canMoveDown, canMoveUp);
    }
}