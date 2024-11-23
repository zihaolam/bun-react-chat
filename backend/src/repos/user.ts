import { Database } from 'bun:sqlite'
import type { models } from 'src/db'
import { prefixWith$ } from './utils'
import type { UserValidators } from '@shared/validators'

const insertUser = (db: Database, data: UserValidators.CreateUserSchema) => {
    const values = prefixWith$(data)
    return db
        .query<
            models.Account,
            typeof values
        >(`INSERT INTO accounts (username) VALUES ($username) ON CONFLICT(username) DO UPDATE set username = excluded.username RETURNING *`)
        .get(values)
    // for now just do on conflict do update username so we can upsert and return the user always.
}

const getUser = (db: Database, id: number) => {
    const values = prefixWith$({ id })
    return db.query<models.Account, typeof values>(`SELECT * FROM accounts WHERE id = $id LIMIT 1`).get(values)
}

// TODO: add filter for conversations which are not started by the user, for now filter in the frontend due to time constraints
const getUsers = (db: Database) => {
    // TODO: paginate results
    return db.query<models.Account, null>(`SELECT * FROM accounts`).all(null)
}

export const userRepo = {
    getUser,
    insertUser,
    getUsers,
}
