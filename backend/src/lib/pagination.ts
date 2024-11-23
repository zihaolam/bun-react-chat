type Cursor = string | number | null | undefined
export type Page<T, TCursor extends Cursor = undefined> = {
    items: T[] | undefined
    cursor?: TCursor
    hasNextPage: boolean
}

export const createPage = <T, TCursor extends Cursor = undefined>(
    items: T[],
    { cursorAccessor, limit }: { limit: number; cursorAccessor: (item: T) => TCursor }
): Page<T, Cursor> => {
    return {
        items: items.slice(0, limit),
        cursor: items[items.length - 1] ? cursorAccessor(items[items.length - 1]) : null,
        hasNextPage: items.length > limit,
    }
}
