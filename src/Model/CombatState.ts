export class CurrentCombatState {
    /*
        Creates the current combat state. Active items are zero indexed.
    */
    constructor(readonly round: number, readonly activeItem: number) {}

    next(itemsInRound: number) {
        const nextActiveItem = (this.activeItem + 1) % itemsInRound;
        var nextRound = this.round;
        if(nextActiveItem <= this.activeItem) {
            nextRound++;
        }
        return new CurrentCombatState(nextRound, nextActiveItem);
    }
}

export const NotStarted : CombatState = 'NotStarted';
export type CombatState = 'NotStarted' | CurrentCombatState