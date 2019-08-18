import { defineEvent, EventDefinition, Handler } from "../Core/EventHandlers";
import { HistoryEntry } from "./HistoryEntries";

/**
 * This module provides the interface for Quick Initiative to manage saved
 * initiative items. Items are uniquely identified by their name, as they don't
 * really have any other identity.
 */

const {
    fire: fireHistoryEntryListEvents,
    useEvents: useHistoryItemListEvents,
} = defineEvent(getHistoryItems);

export {
    useHistoryItemListEvents,
    useHistoryItemEvents,
    getHistoryItems,
    addHistoryItem,
    addHistoryItemToGroup,
    removeHistoryItem,
    removeHistoryItemFromGroup,
    renameGroup,
    saveToLocalStorage
}

// In-application representation of history items.
// Each value has the item itself and the event definition for that item.
const historyItems: Map<string, { entry: HistoryEntry, handlers: EventDefinition<HistoryEntry> }> = new Map();

function getHistoryItems(): HistoryEntry[] {
    return Array.from(historyItems.values(), x => x.entry);
}

/**
 * 
 * @param name The name of the item to register with for updates.
 * @param handler The update handler.
 */
function useHistoryItemEvents(name: string, handler: Handler<HistoryEntry>): HistoryEntry {
    var item = historyItems.get(name);
    if (!item) {
        throw new Error("Tried to get events for non-existant entry.");
    }
    return item.handlers.useEvents(handler);
}

/**
 * Adds a new history item, if it doesn't exist.
 * @param name The name of the new item.
 * @param groups The groups to add the item to initially.
 * @returns true, if and only if a new item was added.
 */
function addHistoryItem(name: string, groups: string[]): boolean {
    if (historyItems.has(name)) {
        return false;
    }

    const entry = new HistoryEntry(name);
    groups.forEach(group => {
        entry.groups.add(group);
    });

    historyItems.set(name,
        {
            entry: entry,
            handlers: defineEvent(() => {
                var item = historyItems.get(name);
                if (item) {
                    return item.entry;
                }
                throw new Error("Missing history item.");
            })
        });
    fireHistoryEntryListEvents();
    return true;
}

function removeHistoryItem(item: HistoryEntry) {
    if(historyItems.delete(item.name)) {
        fireHistoryEntryListEvents();
    }
}

function addHistoryItemToGroup(item: HistoryEntry, group: string) {
    const entry = historyItems.get(item.name);
    if(!entry) {
        throw new Error("Missing history item.")
    }

    entry.entry.groups.add(group);
    entry.handlers.fire();
    fireHistoryEntryListEvents();
}

function removeHistoryItemFromGroup(item: HistoryEntry, group: string) {
    const entry = historyItems.get(item.name);
    if(!entry) {
        throw new Error("Missing history item.")
    }

    if(entry.entry.groups.delete(group)) {
        entry.handlers.fire();
        fireHistoryEntryListEvents();
    }
}

function renameGroup(oldName: string, newName: string) {
    historyItems.forEach(item => {
        if(item.entry.groups.delete(oldName)) {
            item.entry.groups.add(newName);
            item.handlers.fire();
        }
    });
    fireHistoryEntryListEvents();
}

function saveToLocalStorage() {
    localStorage.setItem("historyItems",
        JSON.stringify(getHistoryItems().map((x: HistoryEntry): object =>
            ({ name: x.name, groups: Array.from(x.groups).filter(x => x.length > 0)}))));
}

// History items are loaded on module load.
const storedItems = localStorage.getItem("historyItems");
if (storedItems) {
    const storedJson = JSON.parse(storedItems);
    storedJson.forEach((element: any) => {
        addHistoryItem(element.name, element.groups);
    });
}