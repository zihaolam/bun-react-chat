import { Suspense } from 'react'
import { Typewriter } from '@frontend/components/typewriter'
import { ConversationList } from './conversation-list'
import { useSession } from '@frontend/queries/user'
import { useRouterState } from '@tanstack/react-router'
import { UserSearch, UserSearchInput } from './user-search'
import { LogoutButton } from '../logout-button'

export const Conversation = () => {
    const { data: session } = useSession()
    const router = useRouterState()

    return (
        <div
            // hide conversation list when in mobile because the homepage is esssentially the conversation list
            className="sm:w-[250px] data-[hide=true]:hidden bg-white duration-200 w-screen border-r h-screen sm:data-[hide=true]:flex sm:data-[hide=false]:flex flex-col"
            data-hide={router.location.pathname.includes('/chat')}
        >
            <div className="flex items-center justify-between px-2 h-8 border-b">
                <h1 className="text-sm font-semibold">username: {session?.username}</h1>
                <LogoutButton className="sm:block" />
            </div>
            <div className="shrink-0">
                <Suspense fallback={<UserSearchInput isLoading />}>
                    <UserSearch />
                </Suspense>
            </div>
            <div className="max-h-full overflow-y-auto h-full flex-1">
                <Suspense
                    fallback={
                        <div className="w-full flex justify-center py-4">
                            <Typewriter content="Loading..." />
                        </div>
                    }
                >
                    <ConversationList />
                </Suspense>
            </div>
        </div>
    )
}
