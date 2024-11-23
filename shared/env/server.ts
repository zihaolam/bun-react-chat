import path from 'path'
import { validateEnv } from './utils'
import type { ServerEnv } from './types'

export const ROOT_DIR = process.cwd()

const ENV_VAR_KEYS: (keyof ServerEnv)[] = ['VITE_BACKEND_PORT', 'VITE_BACKEND_HOST', 'SQLITE_DATABASE_PATH']

const createServerEnv = (): ServerEnv => {
    validateEnv(ENV_VAR_KEYS)
    return {
        // we can null assert here because validateEnv has already checked for existence of env vars
        VITE_BACKEND_PORT: Number(process.env.VITE_BACKEND_PORT!),
        VITE_BACKEND_HOST: process.env.VITE_BACKEND_HOST!,
        SQLITE_DATABASE_PATH: path.join(ROOT_DIR, process.env.SQLITE_DATABASE_PATH!),
    }
}

export const serverEnv = createServerEnv()
