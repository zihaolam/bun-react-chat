import { Suspense } from 'react'
import { Typewriter } from '@frontend/components/typewriter'
import { ConversationList } from './conversation-list'
import { NewConversationButton } from './new-conversation'
import { NewConversationButtonWithDialog } from './new-conversation'
import { Button } from 'react-aria-components'
import { useLogout, useSession } from '@frontend/queries/user'

export const Conversation = () => {
    const { mutate, isPending } = useLogout()
    const { data: session } = useSession()
    return (
        <div className="sm:w-[250px] duration-200 w-[80vw] border-r h-screen flex flex-col">
            <div className="flex items-center justify-between px-2 h-8 border-b">
                <h1 className="text-sm font-semibold">username: {session.username}</h1>
                <Suspense fallback={<NewConversationButton className="bg-black/80" isDisabled />}>
                    <NewConversationButtonWithDialog />
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
            <div className="p-2">
                <Button
                    className={({ isDisabled }) =>
                        `border rounded w-full py-1.5 font-medium text-sm ${isDisabled ? 'bg-gray-100' : 'bg-white'}`
                    }
                    isDisabled={isPending}
                    onPress={() => mutate()}
                >
                    Logout
                </Button>
            </div>
        </div>
    )
}
