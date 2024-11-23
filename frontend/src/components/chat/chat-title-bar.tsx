import { useChatContext } from '@frontend/contexts/chat-context'

export const ChatTitleBar = () => {
    const { receiver } = useChatContext()
    return (
        <div className="flex items-center px-2 h-8 border-b">
            <h1 className="text-sm font-semibold">👤 {receiver?.username}</h1>
        </div>
    )
}
