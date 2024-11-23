import { Conversation } from '@frontend/components/conversation'
import { ChatWindow } from './chat-window'
import { useWebsocket } from '@frontend/hooks/use-websocket'
import { clientEnv } from '@shared/env/client'
import { WebsocketValidators } from '@shared/validators'
import { useSession } from '@frontend/queries/user'
import { useOptimisticUpdateConversationMessage, useRefetchMyConversations } from '@frontend/queries/message'

export const Chat = () => {
    const { data: session } = useSession()
    const updateConversationMessage = useOptimisticUpdateConversationMessage()
    const refetchMyConversations = useRefetchMyConversations()
    const [SocketConnection] = useWebsocket(
        `ws://${clientEnv.VITE_BACKEND_HOST}:${clientEnv.VITE_BACKEND_PORT}/api/ws`,
        {
            onMessage: data => {
                const validated = WebsocketValidators.wsNewMessageValidator.safeParse(data)
                if (!validated.success) {
                    return
                }
                refetchMyConversations()
                updateConversationMessage(validated.data.message, session?.id ?? 0)
            },
            onOpen: ws => {
                if (!session) return
                ws.send(
                    JSON.stringify({
                        action: 'subscribe',
                        payload: {
                            topic: `${session.id}`,
                        },
                    } satisfies WebsocketValidators.WsSubscriptionSchema)
                )
            },
        }
    )
    return (
        <main className="w-screen h-[100dvh] max-h-[100dvh] overflow-hidden max-w-[100vw] flex">
            <SocketConnection />
            <Conversation />
            <ChatWindow />
        </main>
    )
}
