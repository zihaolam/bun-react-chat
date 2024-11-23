import { connectDB } from 'src/db/client'
import { getCookies } from './cookies'
import { Database } from 'bun:sqlite'

// factory to inject dependencies to the create context function
export const createRequestContextFactory = () => {
    const db = connectDB()

    return (req: Request): RequestContext => {
        const cookies = getCookies(req)

        return {
            req,
            db,
            account_id: Number(cookies['account_id']),
        }
    }
}

export const createRequestContext = createRequestContextFactory()

export interface RequestContext {
    req: Request
    db: Database
    account_id?: number
}

export type AuthenticatedRequestContext = RequestContext & { account_id: number }
