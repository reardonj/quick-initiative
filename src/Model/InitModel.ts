
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
    duplicateInitEntry,
    removeInitEntry,
    moveInitEntryDown,
    moveInitEntryUp,
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
    let itemIndex = findAddIndex(init);
    addInitAtIndex(name, init, itemIndex);
}

function addInitAtIndex(name: string, init: number, itemIndex: number) {
    const id = nextInitId++;
    let item = new InitiativeEntry(name, init, id, false, false, false)
    initiativeItems.splice(itemIndex, 0, item.id);

    // If we added an item above the current item in combat, move the activeItem down one.
    if (combatState instanceof CurrentCombatState && combatState.activeItem <= itemIndex) {
        combatState = new CurrentCombatState(combatState.round, combatState.activeItem + 1)
        fireCombatStateEvents();
    }
    initiativeItemLookup[item.id] = {
        entry: item,
        handlers: createEventHandler(() => initiativeItemLookup[item.id].entry)
    };
    updateSurroundingMovement(itemIndex);
    fireInitEntryEvents();
}

function findAddIndex(init: number): number {
    for (var i = 0; i < initiativeItems.length; i++) {
        if (initIndexToEntry(i).entry.init <= init) {
            return i;
        }20
    }

    return initiativeItems.length;
}

function duplicateInitEntry(item: InitiativeEntry, times: number) {
    const index = initiativeItems.findIndex(x => x == item.id)
    const info = initiativeItemLookup[initiativeItems[index]];
    for (let i = 0; i < times; i++) {
        let name = info.entry.name + " (" + (i + 2) + ")";
        addInitAtIndex(name, info.entry.init, index + 1 + i);
    }
    info.entry = new InitiativeEntry(info.entry.name + " (" + 1 + ")",
        info.entry.init, info.entry.id, info.entry.active, info.entry.canMoveDown, info.entry.canMoveUp);
    info.handlers.fire();
}

function removeInitEntry(entry: InitiativeEntry) {
    const index = initiativeItems.findIndex(x => x == entry.id);
    if (index == -1) {
        throw new Error("Tried to remove initiative entry that doesn't exist. ID:" + entry.id);
    }
    initiativeItems.splice(index, 1);
    delete initiativeItemLookup[entry.id];
    fireInitEntryEvents();
    updateSurroundingMovement(Math.min(index, initiativeItems.length - 1));

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
}

function moveInitEntryDown(entry: InitiativeEntry) {
    const index = initiativeItems.findIndex(x => x == entry.id);
    if (index == -1) {
        throw new Error("Tried to move initiative entry that doesn't exist. ID:" + entry.id);
    }

    if (index == initiativeItems.length - 1) {
        return;
    }

    swapInits(index, index + 1);
}

function moveInitEntryUp(entry: InitiativeEntry) {
    const index = initiativeItems.findIndex(x => x == entry.id);
    if (index == -1) {
        throw new Error("Tried to move initiative entry that doesn't exist. ID:" + entry.id);
    }
    if (index == 0) {
        return;
    }

    swapInits(index, index - 1);
}

function swapInits(index1: number, index2: number) {
    var originalEntry = initiativeItems[index1];
    initiativeItems[index1] = initiativeItems[index2];
    initiativeItems[index2] = originalEntry;

    const firstEvent = updateMovementForIndex(index1);
    const secondEvent = updateMovementForIndex(index2);

    if (combatState instanceof CurrentCombatState) {
        if (index1 == combatState.activeItem) {
            combatState = new CurrentCombatState(combatState.round, index2);
            fireCombatStateEvents();
        } else if (index2 == combatState.activeItem) {
            combatState = new CurrentCombatState(combatState.round, index1);
            fireCombatStateEvents();
        }
    }
    fireInitEntryEvents();
    firstEvent();
    secondEvent();
}

function updateMovementForIndex(index: number): (() => void) {
    const entry = initIndexToEntry(index);
    entry.entry = entry.entry.updateMovement(index, initiativeItems.length);
    return entry.handlers.fire;
}

function updateSurroundingMovement(index: number) {
    if (index >= initiativeItems.length || index < 0) {
        return;
    }

    updateMovementForIndex(index)();
    if (index > 0) {
        updateMovementForIndex(index - 1)();
    }
    if (index < initiativeItems.length - 1) {
        updateMovementForIndex(index + 1)();
    }
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
