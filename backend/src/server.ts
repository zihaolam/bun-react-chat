import { serverEnv } from '@shared/env/server'
import { handleRoutes } from './router'
import { websocketManager } from './lib/websocket'
import { uid } from './lib/uid'
import type { ServerWebSocket } from 'bun'
import { WebsocketValidators } from '@shared/validators'

export const serve = () => {
    console.info('Starting server at http://%s:%s', serverEnv.VITE_BACKEND_HOST, serverEnv.VITE_BACKEND_PORT)
    return Bun.serve({
        fetch: handleRoutes,
        websocket: {
            open: ws => {
                const wsId = uid()
                ws.data = { id: wsId }
                websocketManager.add(wsId, ws as ServerWebSocket<{ id: string }>)
            },
            message: (ws, msg) => {
                // handle subscription requests from clients
                try {
                    if (typeof msg !== 'string') {
                        return
                    }
                    const jsonMsg = JSON.parse(msg)
                    const validated = WebsocketValidators.wsSubscriptionValidator.safeParse(jsonMsg)
                    if (validated.success) {
                        websocketManager.subscribe(ws.data.id, validated.data.payload.topic)
                    }
                } catch (e) {
                    console.error('Failed to parse message: ', e)
                }
            },
            close: (ws: ServerWebSocket<{ id: string }>) => {
                websocketManager.remove(ws.data.id)
            },
        },
        port: serverEnv.VITE_BACKEND_PORT,
        hostname: serverEnv.VITE_BACKEND_HOST,
    })
}
