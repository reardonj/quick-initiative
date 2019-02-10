
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
    removeInitEntry,
    getInitItems,
    subscribeToInitEntries,
    unsubscribeToInitEntries,
    subscribeToInitEntry,
    unsubscribeToInitEntry
}

/* Combat State */

let combatState = NotStarted;
const { fire: fireCombatStateEvents, subscribe: subscribeToCombatState, unsubscribe: unsubscribeToCombatState } =
    createEventHandler(() => combatState);

function startCombat() {
    if (initiativeItems.length == 0) {
        return;
    }
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
const { fire: fireInitEntryEvents, subscribe: subscribeToInitEntries, unsubscribe: unsubscribeToInitEntries } =
    createEventHandler(() => getInitItems);

function subscribeToInitEntry(id: number, handler: Handler<InitiativeEntry>) {
    return initiativeItemLookup[id].handlers.subscribe(handler);
}

function unsubscribeToInitEntry(id: number, handler: Handler<InitiativeEntry>) {
    const entry = initiativeItemLookup[id]
    return entry && entry.handlers.unsubscribe(handler);
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

function removeInitEntry(entry: InitiativeEntry) {
    const index = initiativeItems.findIndex(x => x == entry.id);
    if (index == -1) {
        throw new Error("Tried to remove initiative entry that doesn't exist. ID:" + entry.id);
    }
    initiativeItems.splice(index, 1);
    delete initiativeItemLookup[entry.id];

    if (combatState instanceof CurrentCombatState) {
        if (initiativeItems.length == 0) {
            combatState = NotStarted;
        } else if (index >= combatState.activeItem) {
            // The active index has to be updated.
            const newActiveIndex = Math.max(0, combatState.activeItem - 1);
            combatState = new CurrentCombatState(combatState.round, newActiveIndex);

            // And the actual active item if we removed the current selection.
            if (entry.active) {
                const newActiveItem = initIndexToEntry(newActiveIndex);
                toggleActive(newActiveItem)
                newActiveItem.handlers.fire();
            }
        }
        fireCombatStateEvents();
    }
    fireInitEntryEvents();
}

function nextInit() {
    if (!(combatState instanceof CurrentCombatState)) {
        return;
    }
    const lastItem = initiativeItemLookup[initiativeItems[combatState.activeItem]];
    combatState = combatState.next(initiativeItems.length);
    const nextItem = initiativeItemLookup[initiativeItems[combatState.activeItem]];

    toggleActive(lastItem);
    toggleActive(nextItem);

    fireCombatStateEvents();
    lastItem.handlers.fire();
    nextItem.handlers.fire();
}

function toggleActive(info: InitiativeInfo) {
    initiativeItemLookup[info.entry.id].entry = info.entry.toggleActive();
}
