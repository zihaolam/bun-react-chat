import { ZodIssueCode, z } from 'zod'

export const paginationValidatorFields = {
    cursor: z.string().nullish(),
    limit: z.number(),
}
export const paginationValidator = z.object(paginationValidatorFields)

export type PaginationSchema = z.infer<typeof paginationValidator>

export const parseJsonPreprocessor = (value: any, ctx: z.RefinementCtx) => {
    if (typeof value === 'string') {
        try {
            return JSON.parse(value)
        } catch (e) {
            ctx.addIssue({
                code: ZodIssueCode.custom,
                message: (e as Error).message,
            })
        }
    }

    return value
}
