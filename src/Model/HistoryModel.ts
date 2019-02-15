import { createEventHandler, EventDefinition, Handler } from "../Core/EventHandlers";
import { HistoryEntry } from "./HistoryEntries";

export {
    useHistoryItemListEvents,
    useHistoryItemEvents,
    getHistoryItems,
    addHistoryItem,
    toggleFavourite,
    saveToLocalStorage
}

const historyItems: Map<string, { entry: HistoryEntry, handlers: EventDefinition<HistoryEntry> }> = new Map();
const {
    fire: fireHistoryEntryListEvents,
    useEvents: useHistoryItemListEvents,
} = createEventHandler(getHistoryItems);

function getHistoryItems(): HistoryEntry[] {
    return Array.from(historyItems.values(), x => x.entry);
}

function useHistoryItemEvents(name: string, handler: Handler<HistoryEntry>) {
    var item = historyItems.get(name);
    if (!item) {
        throw new Error("Tried to get evetns for non-existant entry.");
    }
    item.handlers.useEvents(handler);
}

function toggleFavourite(name: string) {
    var item = historyItems.get(name);
    if (item) {
        item.entry.isFavourite = !item.entry.isFavourite;
        item.handlers.fire();
    }
    fireHistoryEntryListEvents();
}

function addHistoryItem(name: string) {
    if (historyItems.has(name)) {
        return;
    }
    const entry = new HistoryEntry(name);
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
            ({ name: x.name, isFavourite: x.isFavourite }))));
}


const storedItems = localStorage.getItem("historyItems");
if (storedItems) {
    const storedJson = JSON.parse(storedItems);
    storedJson.forEach((element: any) => {
        addHistoryItem(element.name);
        if (element.isFavourite) {
            toggleFavourite(element.name);
        }
    });
}