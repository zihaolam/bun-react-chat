import { setCookie, type CookieOptions } from './cookies'

export type HTTPError = string | string[] | string[][] | null

interface CookieRecord {
    name: string
    value: string
    options: CookieOptions
}

export class HTTPResponse<T, E extends HTTPError> {
    body: string
    cookies: CookieRecord[]

    constructor(
        public data: T,
        public errors: E | null = null,
        public statusCode: number = 200
    ) {
        this.cookies = []
        if (errors?.length) {
            this.body = JSON.stringify({ errors })
        } else if (typeof data === 'string') {
            this.body = data
        } else {
            this.body = JSON.stringify(data)
        }
        this.statusCode = statusCode
    }

    get response() {
        const res = new Response(this.body, {
            status: this.statusCode,
        })
        this.cookies.forEach(({ name, value, options }) => {
            setCookie(res, name, value, options)
        })
        return res
    }

    setCookie(name: string, value: string, options: CookieOptions = {}): void {
        this.cookies.push({ name, value, options })
    }

    deleteCookie(name: string): void {
        this.cookies.push({ name, value: '', options: { maxAge: 0 } })
    }
}
