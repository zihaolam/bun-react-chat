import { z } from 'zod'

export const createUserValidator = z.object({
    username: z.string().min(3),
})
export type CreateUserSchema = z.infer<typeof createUserValidator>