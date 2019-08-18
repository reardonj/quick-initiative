/*
  The current state of the initiative order, defined by the current round and
  index of active initiative item.
*/
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

// A constant representing the state where combat hasn't started.
export const NotStarted : CombatState = 'NotStarted';

// The state of combat is either 
// - not started; or
// - the current state of the initiative.
export type CombatState = 'NotStarted' | CurrentCombatState