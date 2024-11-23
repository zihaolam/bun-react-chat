import { paginationValidatorFields } from './commons'
import { z } from 'zod'

export const baseMessageValidator = z.object({
    id: z.string(),
    content: z.string(),
    from_id: z.number(),
    to_id: z.number(),
    sent_at: z.number(),
})

export const insertMessageValidator = z.object({
    to_id: z.number(),
    content: z.string().min(1),
})

export type InsertMessageSchema = z.infer<typeof insertMessageValidator>

export const getConversationMessagesValidator = z.object({
    ...paginationValidatorFields,
    to_id: z.number(),
})

export type GetConversationMessagesSchema = z.infer<typeof getConversationMessagesValidator>
