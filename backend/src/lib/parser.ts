export const parseParams = (req: Request) => {
    const url = new URL(req.url).searchParams
    const params = url.get('filters')
    try {
        if (!params) {
            return [null, 'filter is required'] as const
        }
        return [JSON.parse(params) as unknown, null] as const
    } catch (e) {
        return [null, 'filter must be a valid JSON'] as const
    }
}

export const parseFormBody = async (req: Request) => {
    try {
        const body = await req.json()
        if (!body) {
            return [null, 'body is required'] as const
        }
        return [body as unknown, null] as const
    } catch (e) {
        return [null, 'body must be a valid JSON'] as const
    }
}
