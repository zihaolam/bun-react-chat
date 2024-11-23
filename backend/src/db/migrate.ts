import { connectDB } from './client'
import { $ } from 'bun'
import path from 'path'

const BREAKPOINT_STR = '==== breakpoint ===='

const SCHEMA_SQL_PATH = path.join(import.meta.dir, 'schema.sql')

const migrate = async () => {
    const db = connectDB()
    const file = await $`cat ${SCHEMA_SQL_PATH}`.text()
    const stmts = file.split(BREAKPOINT_STR)

    const txnCb = db.transaction((stmts: string[]) => {
        for (const stmt of stmts) {
            db.run(stmt)
        }
    })

    return txnCb(stmts)
}

if (import.meta.main) {
    const time = Date.now()
    console.info('Starting migration')
    await migrate()
    console.info(`Migration complete, ${(Date.now() - time) / 1000}s ellapsed`)
    process.exit(0)
}
