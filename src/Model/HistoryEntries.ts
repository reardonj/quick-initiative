/**
 * A single previously definined initiative item, and the groups it belongs to.
 */
export class HistoryEntry {

    groups: Set<string>;

    constructor(readonly name: string) {
        this.groups = new Set();
    }
}

/**
 * A sorting comparator, using the names of history entries.
 */
export function defaultHistoryEntrySort(a: HistoryEntry, b: HistoryEntry): number {
    return a.name.localeCompare(b.name);
}