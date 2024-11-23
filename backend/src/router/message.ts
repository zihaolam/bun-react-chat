import { CommonValidators, MessageValidators } from '@shared/validators'
import { repos } from '@backend/repos'
import { parseFormBody, parseParams } from '@backend/lib/parser'
import type { AuthenticatedRequestContext } from '@backend/lib/context'
import { HTTPResponse } from 'src/lib/response'
import { websocketManager } from 'src/lib/websocket'

export const handleGetConversationMessages = (ctx: AuthenticatedRequestContext) => {
    const [data, err] = parseParams(ctx.req)
    if (err) {
        return new HTTPResponse(null, err, 400)
    }

    const filters = MessageValidators.getConversationMessagesValidator.safeParse(data)

    if (!filters.success) {
        return new HTTPResponse(null, filters.error.flatten().formErrors, 400)
    }

    const conversationMessages = repos.conversation.getConversationMessages(ctx.db, {
        ...filters.data,
        from_id: ctx.account_id,
    })
    return new HTTPResponse(conversationMessages)
}

export const handleGetConversations = (ctx: AuthenticatedRequestContext) => {
    const [data, err] = parseParams(ctx.req)

    if (err) {
        return new HTTPResponse(null, err, 400)
    }

    const filters = CommonValidators.paginationValidator.safeParse(data)
    if (!filters.success) {
        return new HTTPResponse(null, filters.error.flatten().formErrors, 400)
    }
    const conversations = repos.conversation.getConversations(ctx.db, { ...filters.data, from_id: ctx.account_id })
    return new HTTPResponse(conversations)
}

export const handleInsertMessage = async (ctx: AuthenticatedRequestContext) => {
    const [data, err] = await parseFormBody(ctx.req)
    if (err) {
        return new HTTPResponse(null, err, 400)
    }
    const filters = MessageValidators.insertMessageValidator.safeParse(data)
    if (!filters.success) {
        return new HTTPResponse(null, filters.error.flatten().formErrors, 400)
    }
    const newMessage = repos.message.insertMessage(ctx.db, { ...filters.data, from_id: ctx.account_id })
    if (!newMessage) {
        return new HTTPResponse(null, 'Internal Server Error', 500)
    }
    websocketManager.broadcast(newMessage.to_id.toString(), newMessage)
    return new HTTPResponse(newMessage)
}
