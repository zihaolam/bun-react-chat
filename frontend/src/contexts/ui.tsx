import React from 'react'

interface UIContext {
    isConversationListOpen: boolean
    setIsConversationListOpen: React.Dispatch<React.SetStateAction<boolean>>
}
const UIContext = React.createContext<UIContext>({
    isConversationListOpen: false,
    setIsConversationListOpen: () => {},
})

export const UIContextProvider = ({ children }: React.PropsWithChildren) => {
    const [isConversationListOpen, setIsConversationListOpen] = React.useState(false)
    return (
        <UIContext.Provider value={{ isConversationListOpen, setIsConversationListOpen }}>
            {children}
        </UIContext.Provider>
    )
}

export const useUIContext = () => {
    const ctx = React.useContext(UIContext)
    if (!ctx) throw new Error('useChatContext must be used within a ChatContextProvider')
    return ctx
}
