import { useMyConversations } from '@frontend/queries/message'
import React from 'react'
import { useSession } from '@frontend/queries/user'
import { models } from '@backend/db'
import { Button } from 'react-aria-components'
import { useChatContext } from '@frontend/contexts/chat-context'

interface ConversationItemProps {
    conversation: models.Conversation
    session: models.Account
}
const ConversationItem = ({ conversation, session }: ConversationItemProps) => {
    const { setReceiver } = useChatContext()

    // quick hack to build receiver object
    const receiver = React.useMemo(() => {
        return conversation.from_id === session.id
            ? {
                  id: conversation.to_id,
                  username: conversation.to_username,
              }
            : {
                  id: conversation.from_id,
                  username: conversation.from_username,
              }
    }, [session, conversation])

    const renderDate = () => {
        const today = new Date()
        const date = new Date(conversation.sent_at * 1000)
        const isoDate = date.toISOString().split('T')
        // if today, show only HH:MM:SS
        if (today.toDateString() === date.toDateString()) {
            return isoDate[1].split('.')[0]
        }

        // else show only YYYY-MM-DD
        return isoDate[0]
    }

    return (
        <Button className="px-2 py-1 last:border-b block text-left w-full" onPress={() => setReceiver(receiver)}>
            <div className="flex justify-between">
                <span className="font-semibold text-sm ">👤 {receiver.username}</span>
                <span className="text-[0.65rem] font-light text-black/50">{renderDate()}</span>
            </div>
            <div className="text-xs text-black/50">
                {conversation.from_id === session.id ? 'me:' : ''} {conversation.content}
            </div>
        </Button>
    )
}

export const ConversationList = () => {
    const { data: conversationPages } = useMyConversations()
    const conversations = React.useMemo(() => {
        return conversationPages.pages.flatMap(page => page.items ?? [])
    }, [conversationPages])

    const { data: session } = useSession()

    return (
        <div className="divide-y">
            {conversations.length ? (
                conversations.map(conversation => (
                    <ConversationItem conversation={conversation} session={session} key={conversation.id} />
                ))
            ) : (
                <div className="text-center py-2 text-xs font-medium text-black/50">No conversations yet</div>
            )}
        </div>
    )
}
