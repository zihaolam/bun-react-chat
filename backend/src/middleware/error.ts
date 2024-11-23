import type { RequestContext } from '@backend/lib/context'
import { HTTPException } from '@backend/lib/error'
import type { RouteHandler } from '@backend/router/types'
import { HTTPResponse, type HTTPError } from 'src/lib/response'

export const errorMiddleware = <T, E extends HTTPError, H extends RouteHandler<T, E>>(handler: H) => {
    return (ctx: RequestContext) => {
        try {
            return Promise.resolve(handler(ctx)) as Awaited<ReturnType<H>>
        } catch (e) {
            if (e instanceof HTTPException) {
                return new HTTPResponse(null, e.message, e.status)
            }
            console.error(e)
            return new HTTPResponse(null, 'Internal Server Error', 500)
        }
    }
}
