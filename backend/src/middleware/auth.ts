import { getCookies } from '@backend/lib/cookies'
import type { RequestContext } from '@backend/lib/context'
import type { AuthenticatedRouteHandler } from 'src/router/types'
import { HTTPResponse, type HTTPError } from 'src/lib/response'

export const authMiddleware = <T, E extends HTTPError, H extends AuthenticatedRouteHandler<T, E>>(handler: H) => {
    return (ctx: RequestContext) => {
        const cookies = getCookies(ctx.req)
        const account_id = Number(cookies['account_id'])

        if (!account_id) {
            return new HTTPResponse(null, 'Unauthorized', 401)
        }

        return handler({ ...ctx, account_id }) as Awaited<ReturnType<H>>
    }
}
