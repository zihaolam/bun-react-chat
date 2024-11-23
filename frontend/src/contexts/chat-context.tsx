import type { models } from '@backend/db'
import React from 'react'

interface IChatContext {
    receiver?: models.Account
    setReceiver: React.Dispatch<React.SetStateAction<models.Account | undefined>>
}
const ChatContext = React.createContext<IChatContext>({
    receiver: undefined,
    setReceiver: () => {},
})

export const ChatContextProvider = ({ children }: React.PropsWithChildren) => {
    // TODO: optimize renders with useReducer and dispatch
    const [receiver, setReceiver] = React.useState<models.Account>()
    return <ChatContext.Provider value={{ receiver, setReceiver }}>{children}</ChatContext.Provider>
}

export const useChatContext = () => {
    const ctx = React.useContext(ChatContext)
    if (!ctx) throw new Error('useChatContext must be used within a ChatContextProvider')
    return ctx
}
