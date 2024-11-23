import { useSession } from '@frontend/queries/user'

import { useWebsocket } from '@frontend/hooks/use-websocket'
import { clientEnv } from '@shared/env/client'
import { WebsocketValidators } from '@shared/validators'
import { useOptimisticUpdateConversationMessage, useRefetchMyConversations } from '@frontend/queries/message'

export const ChatSocketListener = () => {
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
                // refetch conversations when new message comes
                // TODO: optimise to use optimistic updates instead of full refetch
                refetchMyConversations()

                // optimistically update message when receive websocket message
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

    return <SocketConnection />
}
