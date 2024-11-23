export interface SharedEnv {
    VITE_BACKEND_PORT: number
    VITE_BACKEND_HOST: string
    SQLITE_DATABASE_PATH: string
    VITE_FRONTEND_PORT: number
}

export type ClientEnv = Omit<SharedEnv, 'SQLITE_DATABASE_PATH'>
export type ServerEnv = SharedEnv
