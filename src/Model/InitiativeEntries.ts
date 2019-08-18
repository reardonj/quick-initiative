/**
 * A readonly epresentation of an initiative entry.
 */
export class InitiativeEntry {
    constructor(
        readonly name: string,
        readonly init: number,
        readonly id: number,
        readonly active: boolean,
        readonly canMoveDown: boolean,
        readonly canMoveUp: boolean) { }

    /**
     * Create a verion of this instance with an updated active state.
     * @param isActive The new active state.
     */
    updateActive(isActive: boolean): InitiativeEntry {
        return new InitiativeEntry(this.name, this.init, this.id, isActive, this.canMoveDown, this.canMoveUp);
    }

    /**
     * Updates the movability state of the entry, returning an updated version.
     * @param index The new index this entry will occupy.
     * @param totalItems The total number of items being displayed.
     */
    updateMovement(index: number, totalItems: number): InitiativeEntry {
        const canMoveDown = index < totalItems - 1;
        const canMoveUp = index > 0;
        return new InitiativeEntry(this.name, this.init, this.id, this.active, canMoveDown, canMoveUp);
    }
}