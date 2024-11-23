import type { RequestContext } from 'src/lib/context'
import type { HTTPError } from 'src/lib/response'
import type { RouteHandler } from 'src/router/types'

export const logRouteDetails = (method: string, pathname: string, status: number) => {
    console.info(`[${new Date().toISOString()}] ${method} - ${pathname} ${status}`)
}

export const loggerMiddleware = <T, E extends HTTPError, H extends RouteHandler<T, E>>(handler: H) => {
    return async (ctx: RequestContext) => {
        const res = (await Promise.resolve(handler(ctx))) as Awaited<ReturnType<H>>
        logRouteDetails(ctx.req.method, new URL(ctx.req.url).pathname, res.response.status)
        return res
    }
}
