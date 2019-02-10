
import { CurrentCombatState, NotStarted, CombatState } from "./CombatState";
import { InitiativeEntry } from "./InitiativeEntries";
import { createEventHandler, Handler, EventDefinition } from "../Core/EventHandlers";

export interface InitiativeInfo { entry: InitiativeEntry, handlers: EventDefinition<InitiativeEntry> };
export type CombatStateHandler = Handler<CombatState>;
export type InitEntryHandler = Handler<InitiativeEntry[]>

export {
    subscribeToCombatState,
    unsubscribeToCombatState,
    startCombat,
    nextInit,
    addInitEntry,
    getInitItems,
    subscribeToInitEntries,
    unsubscribeToInitEntries,
    subscribeToInitEntry,
    unsubscribeToInitEntry
}

/* Combat State */

let combatState = NotStarted;
const {fire: fireCombatStateEvents, subscribe: subscribeToCombatState, unsubscribe: unsubscribeToCombatState} =
    createEventHandler(() => combatState);

function startCombat() {
    combatState = new CurrentCombatState(1, 0);
    const firstEntry = initIndexToEntry(0);
    firstEntry.entry = firstEntry.entry.toggleActive();
    fireCombatStateEvents();
    firstEntry.handlers.fire();
}

/* Initiative Items */

let nextInitId = 0;
const initiativeItems: number[] = [];
const initiativeItemLookup:
    { [id: number]: InitiativeInfo } = {};
const {fire: fireInitEntryEvents, subscribe: subscribeToInitEntries, unsubscribe: unsubscribeToInitEntries} =
    createEventHandler(() => getInitItems);

function subscribeToInitEntry(id: number, handler: Handler<InitiativeEntry>) {
    return initiativeItemLookup[id].handlers.subscribe(handler);
}

function unsubscribeToInitEntry(id: number, handler: Handler<InitiativeEntry>) {
    return initiativeItemLookup[id].handlers.unsubscribe(handler);
}

function getInitItems(): InitiativeEntry[] {
    return initiativeItems.slice().map(x => initiativeItemLookup[x].entry);
}

function initIndexToEntry(i: number): InitiativeInfo {
    return initiativeItemLookup[initiativeItems[i]];
}

function addInitEntry(name: string, init: number) {
    const id = nextInitId++;
    const item = new InitiativeEntry(name, init, id, false)
    let added = false;
    for (var i = 0; i < initiativeItems.length; i++) {
        if (initIndexToEntry(i).entry.init <= init) {
            initiativeItems.splice(i, 0, item.id);
            added = true;
            // If we added an item above the current item in combat, move the activeItem down one.
            if (combatState instanceof CurrentCombatState && combatState.activeItem <= i) {
                combatState = new CurrentCombatState(combatState.round, combatState.activeItem + 1)
                fireCombatStateEvents();
            }
            break;
        }
    }
    if (!added) {
        initiativeItems.push(item.id);
    }
    initiativeItemLookup[item.id] = {
        entry: item,
        handlers: createEventHandler(() => initiativeItemLookup[id].entry)
    };
    fireInitEntryEvents();
}

function nextInit() {
    if (!(combatState instanceof CurrentCombatState)) {
        return;
    }
    const lastItem = initiativeItemLookup[initiativeItems[combatState.activeItem]];
    combatState = combatState.next(initiativeItems.length);
    const nextItem = initiativeItemLookup[initiativeItems[combatState.activeItem]];

    initiativeItemLookup[lastItem.entry.id].entry = lastItem.entry.toggleActive();
    initiativeItemLookup[nextItem.entry.id].entry = nextItem.entry.toggleActive();

    fireCombatStateEvents();
    lastItem.handlers.fire();
    nextItem.handlers.fire();
}
