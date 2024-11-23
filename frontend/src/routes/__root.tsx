import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import { useSession } from '@frontend/queries/user'
import { Typewriter } from '@frontend/components/typewriter'
import { LoginComponent } from '@frontend/components/login'
import { ChatSocketListener } from '@frontend/components/chat'
import { Conversation } from '@frontend/components/conversation'
import { Providers } from '@frontend/components/providers'

export const App = () => {
    const { data, isLoading } = useSession()
    if (isLoading)
        return (
            <div className="flex items-center justify-center w-screen h-screen">
                <Typewriter content="Loading" />
            </div>
        )

    if (!data) return <LoginComponent />

    return (
        <main className="w-screen h-[100dvh] max-h-[100dvh] overflow-hidden max-w-[100vw] flex">
            <ChatSocketListener />
            <Conversation />
            <Outlet />
        </main>
    )
}

export const Route = createRootRoute({
    component: () => (
        <>
            <Providers>
                <App />
            </Providers>
            <TanStackRouterDevtools />
        </>
    ),
})
