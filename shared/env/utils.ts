export const validateEnv = (keys: string[]) => {
    for (const key of keys) {
        if (!import.meta.env[key]) {
            throw new Error(`Missing environment variable: ${key}`)
        }
    }
}
