import { useSession } from '@frontend/queries/user'
import { Typewriter } from './components/typewriter'
import { LoginComponent } from './components/login'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { Chat } from './components/chat'
import { ChatContextProvider } from './contexts/chat-context'

export const App = () => {
    const { data, isLoading } = useSession()
    if (isLoading)
        return (
            <div className="flex items-center justify-center w-screen h-screen">
                <Typewriter content="Loading" />
            </div>
        )

    if (!data) return <LoginComponent />

    return <Chat />
}

export const AppWithProviders = () => {
    const [queryClient] = React.useState(() => new QueryClient())
    return (
        <QueryClientProvider client={queryClient}>
            <ChatContextProvider>
                <App />
            </ChatContextProvider>
        </QueryClientProvider>
    )
}
