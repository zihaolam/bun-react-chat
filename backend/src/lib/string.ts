export function stripSlashes(str: string) {
    return str.replace(/^\/|\/$/g, '') // Remove both starting and trailing slashes
}
