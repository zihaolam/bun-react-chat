import type { SUPPORTED_HTTP_METHODS, Routes } from '@backend/types'
import { clientEnv } from '@shared/env/client'

interface FetcherOptions {
    filters?: unknown
    body?: unknown
}
export const fetcher = async <Method extends SUPPORTED_HTTP_METHODS>(
    method: Method,
    url: keyof Routes[Method],
    opts?: FetcherOptions
) => {
    const { filters, body } = opts ?? {}
    let _url: string = `http://${clientEnv.VITE_BACKEND_HOST}:5173` + (url as string)
    if (filters) {
        const urlWithFilters = new URLSearchParams()
        urlWithFilters.set('filters', JSON.stringify(filters))
        _url = `${url as string}?${urlWithFilters.toString()}`
    }
    const response = await fetch(_url, {
        method,
        headers: body
            ? {
                  'Content-Type': 'application/json',
              }
            : undefined,
        body: body ? JSON.stringify(body) : undefined,
    })
    // TODO: auto infer return type from route handler
    return response
}
