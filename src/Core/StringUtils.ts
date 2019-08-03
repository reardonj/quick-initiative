
export function isNullOrEmpty(str: string | null) {
    return str === null || str.match(/^ *$/) !== null;
}