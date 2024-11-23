import React from 'react'

interface Callbacks {
    onMessage?: (data: unknown) => void
    onOpen?: (socket: WebSocket) => void
    onClose?: (socket: WebSocket) => void
}

export const useWebsocket = (url: string, callbacks?: Callbacks) => {
    const { onMessage, onOpen, onClose } = callbacks ?? {}
    const socket = React.useRef<WebSocket | null>(null)

    // since prohibited to use useEffect, we use a usecallback to hook up the websocket on SocketConnection render
    const refCallback = React.useCallback(() => {
        if (socket.current) {
            socket.current.close()
        }
        const newSocket = new WebSocket(url)
        console.info(newSocket)
        newSocket.onopen = function (this) {
            console.log('Connected')
            onOpen?.(this)
        }
        newSocket.onclose = function (this) {
            console.log('Disconnected')
            onClose?.(this)
        }
        newSocket.onmessage = msg => {
            try {
                const data = JSON.parse(msg.data)
                onMessage?.(data)
            } catch (e) {
                console.error('msg is not json, failed to parse: ', e)
            }
        }
        socket.current = newSocket
    }, [url, onOpen, onClose, onMessage])

    const SocketConnection = React.useCallback(() => {
        return <div className="hidden" ref={refCallback} />
    }, [refCallback])

    return [SocketConnection, socket.current] as const
}
