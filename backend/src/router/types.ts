import type { AuthenticatedRequestContext, RequestContext } from '@backend/lib/context'
import type { HTTPError, HTTPResponse } from '@backend/lib/response'

export type RouteHandler<T, E extends HTTPError> = (
    req: RequestContext
) => HTTPResponse<T, E> | Promise<HTTPResponse<T, E>>
export type AuthenticatedRouteHandler<T, E extends HTTPError> = (
    req: AuthenticatedRequestContext
) => HTTPResponse<T, E> | Promise<HTTPResponse<T, E>>

export interface Route<T, E extends HTTPError> {
    handler: RouteHandler<T, E>
}
