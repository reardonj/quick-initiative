export class HistoryEntry {

    groups: Set<string>;

    constructor(readonly name: string) {
        this.groups = new Set();
    }
}

export function defaultHistoryEntrySort(a: HistoryEntry, b: HistoryEntry): number {
    return a.name.localeCompare(b.name);
}