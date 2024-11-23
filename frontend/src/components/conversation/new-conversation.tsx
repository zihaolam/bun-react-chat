import { Button, ButtonProps, Dialog, DialogTrigger, Heading, Modal } from 'react-aria-components'
import { useSession, useUsers } from '@frontend/queries/user'
import React from 'react'
import { useChatContext } from '@frontend/contexts/chat-context'
import type { models } from '@backend/db'

export const NewConversationButton = ({ className, ...props }: ButtonProps) => {
    return (
        <Button className={`text-xs font-medium rounded bg-black px-2 py-1 text-white ${className}`} {...props}>
            New
        </Button>
    )
}

export const NewConversationButtonWithDialog = () => {
    const { data: users } = useUsers()
    const [isOpen, setIsOpen] = React.useState(false)
    const { setReceiver } = useChatContext()
    const { data: session } = useSession()

    const startConversation = React.useCallback(
        (userId: models.Account) => {
            setReceiver(userId)
            setIsOpen(false)
        },
        [setReceiver]
    )

    return (
        <DialogTrigger>
            <NewConversationButton onPress={() => setIsOpen(true)} />
            <Modal isDismissable isOpen={isOpen} onOpenChange={setIsOpen}>
                <Dialog>
                    <form className="bg-white w-screen h-[100dvh] sm:h-auto max-h-[100dvh] sm:w-[400px] sm:rounded-md">
                        <Heading
                            slot="title"
                            className="font-semibold text-sm border-b px-2 py-1 flex justify-between items-center"
                        >
                            <span>Start a conversation with...</span>
                            <Button onPress={() => setIsOpen(false)}>x</Button>
                        </Heading>
                        <div className="h-full max-h-full overflow-y-auto flex flex-col divide-y">
                            {users
                                .filter(user => user.id !== session.id)
                                .map(user => (
                                    <Button
                                        className="px-2 py-1 text-sm text-left"
                                        onPress={() => startConversation(user)}
                                        key={user.id}
                                    >
                                        👤 {user.username}
                                    </Button>
                                ))}
                        </div>
                    </form>
                </Dialog>
            </Modal>
        </DialogTrigger>
    )
}
