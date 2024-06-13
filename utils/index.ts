// https://stackoverflow.com/a/56757215/6410635
export const dedupe = <T>(items: T[]): T[] => {
    return (items || []).filter(
        (a, i, arr) => arr.findIndex((b) => b === a) === i
    )
}