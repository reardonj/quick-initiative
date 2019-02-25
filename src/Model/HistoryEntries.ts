export class HistoryEntry {
    isFavourite: boolean;

    constructor(readonly name: string) {
        this.isFavourite = false;
    }
}

export function defaultHistoryEntrySort(a: HistoryEntry, b: HistoryEntry): number {
    return a.name.localeCompare(b.name);
}