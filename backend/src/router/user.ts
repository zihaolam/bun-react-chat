import type { AuthenticatedRequestContext, RequestContext } from '@backend/lib/context'
import { repos } from '@backend/repos'
import { UserValidators } from '@shared/validators'
import { parseFormBody, parseParams } from '@backend/lib/parser'
import { HTTPResponse } from '@backend/lib/response'

export const handleGetSession = (ctx: AuthenticatedRequestContext) => {
    const user = repos.user.getUser(ctx.db, ctx.account_id)
    return new HTTPResponse(user)
}

const ACCOUNT_ID_COOKIE_KEY = 'account_id'

export const handleLogin = async (ctx: RequestContext) => {
    const [body, err] = await parseFormBody(ctx.req)
    if (err) {
        return new HTTPResponse(null, err, 400)
    }

    const validated = UserValidators.createUserValidator.safeParse(body)
    if (!validated.success) {
        return new HTTPResponse(null, validated.error.flatten().formErrors, 400)
    }

    const user = repos.user.insertUser(ctx.db, validated.data)
    if (!user) {
        return new HTTPResponse(null, 'Failed to create user', 500)
    }

    const res = new HTTPResponse(user)
    res.setCookie(ACCOUNT_ID_COOKIE_KEY, user.id.toString(), { maxAge: 7 * 24 * 60 * 60 })

    return res
}

export const handleLogout = () => {
    const res = new HTTPResponse(null)
    res.deleteCookie(ACCOUNT_ID_COOKIE_KEY)
    return res
}

export const handleGetUsers = (ctx: RequestContext) => {
    const users = repos.user.getUsers(ctx.db)
    return new HTTPResponse(users)
}

export const handleGetUser = (ctx: RequestContext) => {
    const [data, err] = parseParams(ctx.req)
    if (err) {
        return new HTTPResponse(null, err, 400)
    }

    const validated = UserValidators.getUserValidator.safeParse(data)

    if (!validated.success) {
        return new HTTPResponse(null, validated.error.flatten().formErrors, 400)
    }

    const user = repos.user.getUser(ctx.db, validated.data.userId)
    console.info({ user })
    return new HTTPResponse(user)
}
