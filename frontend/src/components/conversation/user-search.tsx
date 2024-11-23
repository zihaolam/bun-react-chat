import { ComboBox, Input, ListBox, ListBoxItem, Popover } from 'react-aria-components'
import { useSession, useUsers } from '@frontend/queries/user'
import { Search } from '@frontend/components/icons'
import { useNavigate } from '@tanstack/react-router'

interface UserSearchInputProps {
    isLoading?: boolean
}

export const UserSearchInput = ({ isLoading }: UserSearchInputProps) => (
    <div className="w-full relative px-2 py-1.5">
        <Input
            className="bg-gray-200 py-1 w-full border rounded-md pl-6 text-xs disabled:animate-pulse"
            placeholder="Search"
            disabled={isLoading}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/50" />
    </div>
)

export const UserSearch = () => {
    const { data: users } = useUsers()
    const { data: session } = useSession()
    const navigate = useNavigate()
    return (
        <ComboBox aria-label="user search">
            <UserSearchInput />
            <Popover className="w-full">
                <ListBox className="divide-y bg-gray-50 rounded-md shadow-lg text-sm w-[300px] sm:w-[200px]">
                    {users
                        .filter(user => user.id !== session?.id)
                        .map(user => (
                            <ListBoxItem
                                textValue={user.username}
                                className="py-1 px-2 cursor-pointer"
                                key={user.id}
                                onAction={() =>
                                    navigate({ to: '/chat/$receiverId', params: { receiverId: user.id.toString() } })
                                }
                            >
                                👤 {user.username}
                            </ListBoxItem>
                        ))}
                </ListBox>
            </Popover>
        </ComboBox>
    )
}
