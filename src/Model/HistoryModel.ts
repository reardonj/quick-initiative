import { createEventHandler } from "../Core/EventHandlers";
import { HistoryEntry } from "./HistoryEntries";

export {
    subscribeToHistoryItems,
    unsubscribeToHistoryItems,
    getHistoryItems,
    addHistoryItem,
}

let nextHistoryId = 0;
const historyItems: Map<string, HistoryEntry> = new Map();
const {
    fire: fireHistoryEntryEvents,
    subscribe: subscribeToHistoryItems,
    unsubscribe: unsubscribeToHistoryItems
} = createEventHandler(() => getHistoryItems);

function getHistoryItems(): HistoryEntry[] {
    return Array.from(historyItems.values());
}

function addHistoryItem(name: string) {
    if(historyItems.has(name)) {
        return;
    }
    const entry = new HistoryEntry(name, nextHistoryId++);
    historyItems.set(name, entry);
    fireHistoryEntryEvents();
}
