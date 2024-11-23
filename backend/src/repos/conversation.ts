import { Database } from 'bun:sqlite'
import type { models } from '@backend/db'
import { mergeConditions, prefixWith$, removeUndefined } from './utils'
import { createPage } from '@backend/lib/pagination'
import type { MessageValidators } from '@shared/validators'
import type { PaginationSchema } from '@shared/validators/commons'
import type { Conditions } from './types'

const getConversationMessages = (
    db: Database,
    filters: MessageValidators.GetConversationMessagesSchema & { from_id: number }
) => {
    const conditions: Conditions = {
        or: ['from_id = $from_id AND to_id = $to_id', 'to_id = $from_id AND from_id = $to_id'],
        and: [],
    }

    if (filters.cursor) {
        conditions.and.push(`id <= $cursor`)
    }

    const values = prefixWith$(filters)
    const cleaned = removeUndefined(values)

    const items = db
        .query<
            models.Message,
            typeof cleaned
        >(`SELECT * from messages ${mergeConditions(conditions)} ORDER BY id DESC  LIMIT $limit + 1 `)
        .all(cleaned)

    return createPage(items, {
        cursorAccessor: item => item.id,
        limit: filters.limit,
    })
}

const getConversations = (db: Database, filters: PaginationSchema & { from_id: number }) => {
    const where_conditions: string[] = []
    if (filters.cursor) {
        where_conditions.push(`m2.id < $cursor`)
    }

    const values = prefixWith$(filters)
    const cleaned = removeUndefined(values)

    const items = db
        .query<models.Conversation, typeof cleaned>(
            `WITH normalized_messages AS (
                SELECT
                    m.*,
                    CASE WHEN m.from_id < m.to_id THEN m.from_id ELSE m.to_id END as person1,
                    CASE WHEN m.from_id < m.to_id THEN m.to_id ELSE m.from_id END as person2
                FROM messages m
                WHERE (m.from_id = $from_id OR m.to_id = $from_id)
                    ${where_conditions.length ? 'AND ' + where_conditions.join(' AND ') : ''}
            )
            SELECT
                m1.*,
                "from".username as from_username,
                "to".username as to_username
            FROM
                normalized_messages m1
            JOIN accounts "from" ON m1.from_id = "from".id
            JOIN accounts "to" ON m1.to_id = "to".id
            WHERE
                sent_at = (
                    SELECT MAX(sent_at)
                    FROM normalized_messages m2
                    WHERE m2.person1 = m1.person1 
                    AND m2.person2 = m1.person2
                )
            GROUP BY person1, person2
            LIMIT $limit + 1;
        `
        )
        .all(cleaned)

    return createPage(items, {
        cursorAccessor: item => item.id,
        limit: filters.limit,
    })
}

export const conversationRepo = {
    getConversationMessages,
    getConversations,
}
