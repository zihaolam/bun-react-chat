import { Database } from 'bun:sqlite'
import { serverEnv } from '@shared/env/server'

export const connectDB = () => {
    return new Database(serverEnv.SQLITE_DATABASE_PATH)
}
