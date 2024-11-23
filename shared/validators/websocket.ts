import { z } from 'zod'
import type { ZodTypeAny } from 'zod'
import { parseJsonPreprocessor } from './commons'
import { baseMessageValidator } from './message'

export const wsEventValidator = <T extends ZodTypeAny>(messageValidator: T) =>
    z.object({
        topic: z.string(),
        message: z.preprocess(parseJsonPreprocessor, messageValidator),
    })

export const wsNewMessageValidator = wsEventValidator(baseMessageValidator)

export type WsNewMessageSchema = z.infer<typeof wsNewMessageValidator>

export const wsSubscriptionValidator = z.object({
    action: z.literal('subscribe'),
    payload: z.object({
        topic: z.string(),
    }),
})

export type WsSubscriptionSchema = z.infer<typeof wsSubscriptionValidator>
