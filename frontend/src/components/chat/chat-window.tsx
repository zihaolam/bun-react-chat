import { useChatContext } from '@frontend/contexts/chat-context'
import { ChatInput } from './chat-input'
import { ChatTitleBar } from './chat-title-bar'
import { ChatMessageList } from './chat-message-list'
import { Suspense } from 'react'
import { Typewriter } from '../typewriter'

export const ChatWindow = () => {
    const { receiver } = useChatContext()

    if (!receiver) return null

    return (
        <div className="flex-1 h-screen flex flex-col data-[hide=true]:hidden" data-hide={!receiver}>
            <ChatTitleBar />
            <Suspense
                fallback={
                    <div className="w-full h-full flex items-center justify-center">
                        <Typewriter content="Loading messages..." />
                    </div>
                }
            >
                <ChatMessageList />
            </Suspense>
            <ChatInput />
        </div>
    )
}
