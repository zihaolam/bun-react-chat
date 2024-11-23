import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { ChatContextProvider } from '@frontend/contexts/chat-context'
import { UIContextProvider } from '@frontend/contexts/ui'

export const Providers = ({ children }: React.PropsWithChildren) => {
    const [queryClient] = React.useState(() => new QueryClient())
    return (
        <QueryClientProvider client={queryClient}>
            <UIContextProvider>
                <ChatContextProvider>{children}</ChatContextProvider>
            </UIContextProvider>
        </QueryClientProvider>
    )
}
