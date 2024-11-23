import { createRequestContext } from '@backend/lib/context'
import { errorMiddleware } from '@backend/middleware/error'
import { loggerMiddleware, logRouteDetails } from '@backend/middleware/logger'
import { ROUTES, type SUPPORTED_HTTP_METHODS } from './routes'
import { stripSlashes } from '@backend/lib/string'
import type { Route } from './types'
import { isAuthenticated } from 'src/lib/auth'
import type { Server } from 'bun'

export const getRouteHandlers = <Method extends string>(method: Method) => {
    if (method in ROUTES) {
        return ROUTES[method as SUPPORTED_HTTP_METHODS]
    }

    return null
}

export const handleRoutes = (req: Request, server: Server) => {
    const url = new URL(req.url)
    // check if it is a ws connection

    const cleanedpathname = stripSlashes(url.pathname)

    if (cleanedpathname === 'api/ws' && isAuthenticated(req)) {
        console.info('upgrading ws connection')
        server.upgrade(req)
        return
    }

    const handlers = getRouteHandlers(req.method)
    if (handlers === null) {
        logRouteDetails(req.method, url.pathname, 405)
        return new Response('Method Not Allowed', { status: 405 })
    }

    const handler = handlers[cleanedpathname as keyof typeof handlers]
    if (!handler) {
        logRouteDetails(req.method, url.pathname, 404)
        return new Response('Not Found', { status: 404 })
    }

    const ctx = createRequestContext(req)
    const handlerWithMiddlewares = loggerMiddleware(errorMiddleware((handler as Route<unknown, null>).handler)) // have to do type assertion to get around TS error returning never because it does not know the indexed handlers in compiletime

    return Promise.resolve(handlerWithMiddlewares(ctx)).then(res => res.response)
}
