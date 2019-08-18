
/**
 * Check whether a given string is null or is only spaces.
 * @param str The string to check.
 */
export function isNullOrEmpty(str: string | null) {
    return str === null || str.match(/^ *$/) !== null;
}