export class HistoryEntry {
    isFavourite: boolean;

    constructor(readonly name: string) {
        this.isFavourite = false;
    }
}

export function defaultHistoryEntrySort(a: HistoryEntry, b: HistoryEntry): number {
    if(a.isFavourite && !b.isFavourite) {
        return -1;
    }
    if(!a.isFavourite && b.isFavourite) {
        return 1;
    }
    return a.name.localeCompare(b.name);
}