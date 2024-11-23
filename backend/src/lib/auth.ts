import { repos } from 'src/repos'
import { Database } from 'bun:sqlite'
import type { RequestContext } from './context'
import { getCookies } from './cookies'

export const getSession = (ctx: RequestContext, db: Database) => {
    if (!ctx.account_id) {
        return null
    }

    return repos.user.getUser(db, ctx.account_id)
}

export const isAuthenticated = (req: Request) => {
    const cookies = getCookies(req)
    const account_id = Number(cookies['account_id'])

    return !!account_id
}
