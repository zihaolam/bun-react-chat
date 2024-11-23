import { validateEnv } from './utils'
import type { ClientEnv } from './types'

const ENV_VAR_KEYS: (keyof ClientEnv)[] = ['VITE_BACKEND_PORT', 'VITE_BACKEND_HOST']

const createClientEnv = (): ClientEnv => {
    validateEnv(ENV_VAR_KEYS)
    return {
        // we can null assert here because validateEnv has already checked for existence of env vars
        VITE_BACKEND_PORT: Number(import.meta.env.VITE_BACKEND_PORT!),
        VITE_BACKEND_HOST: import.meta.env.VITE_BACKEND_HOST!,
    }
}

export const clientEnv = createClientEnv()
