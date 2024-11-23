import type { Conditions } from './types'

export const prefixWith$ = <T extends Record<string, unknown>>(
    obj: T
): { [K in `$${string & keyof T}`]: T[K extends `$${infer R}` ? R : K] } => {
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [`$${key}`, value])) as {
        [K in `$${string & keyof T}`]: T[K extends `$${infer R}` ? R : K]
    }
}

export const removeUndefined = <T extends Record<string, unknown>>(
    obj: T
): { [K in keyof T]: Exclude<T[K], undefined> } => {
    return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined)) as {
        [K in keyof T]: Exclude<T[K], undefined>
    }
}

export const mergeConditions = (conditions: Conditions): string => {
    if (conditions.and.length && conditions.or.length) {
        return `WHERE (${conditions.and.join(' AND ')}) AND (${conditions.or.join(' OR ')})`
    }

    if (conditions.and.length) {
        return `WHERE ${conditions.and.join(' AND ')}`
    }

    if (conditions.or.length) {
        return `WHERE ${conditions.or.join(' OR ')}`
    }

    return ''
}

export const buildWhereConditions = (whereConditions: string[]) => {
    if (whereConditions.length) {
        return `WHERE ${whereConditions.join(' AND ')}`
    }
    return ''
}
