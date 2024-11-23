import type { ServerWebSocket } from 'bun'

type Topic = string
type SocketId = string
export class WebsocketManager {
    sockets: Map<SocketId, ServerWebSocket<{ id: SocketId }>>
    topics: Map<Topic, Set<SocketId>>
    subscriptions: Map<SocketId, Set<Topic>>

    constructor() {
        this.topics = new Map()
        this.sockets = new Map()
        this.subscriptions = new Map()
    }

    add(id: string, ws: ServerWebSocket<{ id: string }>) {
        this.sockets.set(id, ws)
    }

    remove(id: string) {
        this.sockets.delete(id)
        const subscriptions = this.subscriptions.get(id)
        if (subscriptions) {
            for (const topic of subscriptions) {
                this.unsubscribe(id, topic)
            }
        }
        this.subscriptions.delete(id)
    }

    get(id: string) {
        return this.sockets.get(id)
    }

    subscribe(id: string, topic: string) {
        if (!this.topics.has(topic)) {
            this.topics.set(topic, new Set())
        }
        this.topics.get(topic)!.add(id) // can null assert because already set above

        if (!this.subscriptions.has(id)) {
            this.subscriptions.set(id, new Set())
        }
        this.subscriptions.get(id)!.add(topic)
    }

    unsubscribe(id: string, topic: string) {
        const subscribers = this.topics.get(topic)
        if (subscribers) {
            subscribers.delete(id)
        }
    }

    broadcast(topic: string, message: unknown) {
        const subscribers = this.topics.get(topic)
        if (!subscribers) {
            return
        }
        for (const id of subscribers) {
            const ws = this.sockets.get(id)
            if (!ws) continue
            ws.send(JSON.stringify({ topic, message }))
        }
    }
}

export const websocketManager = new WebsocketManager()
