import { createEventHandler, EventDefinition, Handler } from "../Core/EventHandlers";
import { HistoryEntry } from "./HistoryEntries";

const {
    fire: fireHistoryEntryListEvents,
    useEvents: useHistoryItemListEvents,
} = createEventHandler(getHistoryItems);

export {
    useHistoryItemListEvents,
    useHistoryItemEvents,
    getHistoryItems,
    addHistoryItem,
    saveToLocalStorage
}

const historyItems: Map<string, { entry: HistoryEntry, handlers: EventDefinition<HistoryEntry> }> = new Map();

function getHistoryItems(): HistoryEntry[] {
    return Array.from(historyItems.values(), x => x.entry);
}

function useHistoryItemEvents(name: string, handler: Handler<HistoryEntry>) {
    var item = historyItems.get(name);
    if (!item) {
        throw new Error("Tried to get events for non-existant entry.");
    }
    return item.handlers.useEvents(handler);
}

function addHistoryItem(name: string, groups: string[]) {
    if (historyItems.has(name)) {
        return;
    }

    const entry = new HistoryEntry(name);
    for(const group in groups) {
        entry.groups.add(group);
    }

    historyItems.set(name,
        {
            entry: entry,
            handlers: createEventHandler(() => {
                var item = historyItems.get(name);
                if (item) {
                    return item.entry;
                }
                throw new Error("Missing history item");
            })
        });
    fireHistoryEntryListEvents();
}

function saveToLocalStorage() {
    localStorage.setItem("historyItems",
        JSON.stringify(getHistoryItems().map((x: HistoryEntry): object =>
            ({ name: x.name, groups: Array.from(x.groups.entries())}))));
}


const storedItems = localStorage.getItem("historyItems");
if (storedItems) {
    const storedJson = JSON.parse(storedItems);
    storedJson.forEach((element: any) => {
        addHistoryItem(element.name, element.groups);
    });
}