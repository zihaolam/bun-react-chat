// Helper function to parse cookies manually (if not using request.cookies)
export function getCookies(req: Request) {
    const cookieStr = req.headers.get('cookie')
    if (!cookieStr) return {} // Return empty object if no cookies are present

    return cookieStr.split(';').reduce(
        (cookies, cookie) => {
            const [key, value] = cookie.split('=').map(part => part.trim())
            cookies[key] = decodeURIComponent(value) // Decode URL-encoded values
            return cookies
        },
        {} as Record<string, string>
    )
}

export type CookieOptions = {
    maxAge?: number
    expires?: Date
    path?: string
    domain?: string
    secure?: boolean
    httpOnly?: boolean
    sameSite?: 'Strict' | 'Lax' | 'None'
}

export function setCookie(res: Response, name: string, value: string, options: CookieOptions = {}): void {
    const encodedValue = encodeURIComponent(value)

    const cookieParts = [`${name}=${encodedValue}`]

    if (options.maxAge) cookieParts.push(`Max-Age=${options.maxAge}`)
    if (options.expires) cookieParts.push(`Expires=${options.expires.toUTCString()}`)
    if (options.path) cookieParts.push(`Path=${options.path}`)
    if (options.domain) cookieParts.push(`Domain=${options.domain}`)
    if (options.secure) cookieParts.push('Secure')
    if (options.httpOnly) cookieParts.push('HttpOnly')
    if (options.sameSite) cookieParts.push(`SameSite=${options.sameSite}`)

    const cookieString = cookieParts.join('; ')

    const existingCookies = res.headers.get('Set-Cookie')

    if (!existingCookies) {
        res.headers.set('Set-Cookie', cookieString)
    } else {
        const cookies = Array.isArray(existingCookies)
            ? [...existingCookies, cookieString]
            : [existingCookies.toString(), cookieString]
        res.headers.set('Set-Cookie', cookies.join(' '))
    }
}

export function deleteCookie(res: Response, name: string): void {
    setCookie(res, name, '', { maxAge: 0 })
}
