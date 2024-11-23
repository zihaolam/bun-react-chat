import type { models } from '@backend/db'
import { useChatContext } from '@frontend/contexts/chat-context'
import { useConversationMessage } from '@frontend/queries/message'
import React from 'react'
import { useSession } from '@frontend/queries/user'

interface ChatMessageProps {
    message: models.Message
    userId: number
}

const ChatMessage = ({ message, userId }: ChatMessageProps) => {
    return (
        <div data-issender={message.from_id === userId} className="flex w-full data-[issender=true]:justify-end">
            <div className="px-2 py-1 rounded bg-white shadow inline-block">
                <div className="mb-0.5 text-sm">{message.content}</div>
                <div className="text-[0.65rem] text-right text-black/50">
                    {new Date(message.sent_at * 1000).toLocaleString()}
                </div>
            </div>
        </div>
    )
}

export const ChatMessageList = () => {
    const { receiver } = useChatContext()
    const { data: messagePages, isFetching, fetchNextPage } = useConversationMessage(receiver?.id)

    console.info({ receiver, messagePages })
    const { data: session } = useSession()
    const [needScrollToBottom, setNeedScrollToBottom] = React.useState(true)
    const messages = React.useMemo(() => {
        return messagePages.pages.flatMap(page => page.items ?? []).toReversed()
    }, [messagePages])

    const scrollToBottomRefCallback = React.useCallback(
        (node: HTMLDivElement | null) => {
            if (node && needScrollToBottom) {
                node.scrollIntoView({ behavior: 'smooth' })
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [messages.length, needScrollToBottom]
    )

    const loadMoreMessages = React.useCallback(() => {
        if (isFetching) return
        fetchNextPage()
    }, [fetchNextPage, isFetching])

    return (
        <div
            className="bg-gray-100 flex-1 border-b h-full space-y-2 px-2 py-2 max-h-full overflow-y-auto"
            onScroll={el => {
                // check if scrolled to bottom, then toggle needSCrollToBottom(true)
                if (el.currentTarget.scrollTop === el.currentTarget.scrollHeight - el.currentTarget.clientHeight) {
                    setNeedScrollToBottom(true)
                } else {
                    setNeedScrollToBottom(false)
                }
                if (el.currentTarget.scrollTop <= 10) {
                    loadMoreMessages()
                }
            }}
        >
            {messages.length ? (
                messages.map(msg => <ChatMessage userId={session.id} key={msg.id} message={msg} />)
            ) : (
                <div className="flex items-center justify-center py-4 text-black/40 text-sm">No messages yet</div>
            )}
            <div ref={scrollToBottomRefCallback} />
        </div>
    )
}
