import { Database } from 'bun:sqlite'
import { MessageValidators } from '@shared/validators'
import type { models } from '@backend/db'
import { prefixWith$ } from './utils'
import { uid } from '@backend/lib/uid'

const MESSAGE_ID_PREFIX = 'msg'

const insertMessage = (db: Database, message: MessageValidators.InsertMessageSchema & { from_id: number }) => {
    const values = prefixWith$(message)
    const query = db.query<models.Message, typeof values & { $sent_at: number; $id: string }>(
        `INSERT INTO messages (id, content, to_id, from_id, sent_at) VALUES ($id, $content, $to_id, $from_id, $sent_at) RETURNING *;`
    )
    return query.get({ ...values, $sent_at: Date.now() / 1000, $id: uid(MESSAGE_ID_PREFIX) })
}

export const messageRepo = {
    insertMessage,
}
