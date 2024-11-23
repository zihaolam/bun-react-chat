import { Link } from '@tanstack/react-router'
import { ArrowLeft } from '@frontend/components/icons'
import { LogoutButton } from '../logout-button'
interface ChatTitleBarProps {
    username: string | undefined
}

export const ChatTitleBar = ({ username }: ChatTitleBarProps) => {
    return (
        <div className="flex gap-x-2 items-center px-2 h-8 border-b">
            <Link to="/" className="sm:hidden block">
                <ArrowLeft />
            </Link>
            <h1 className="text-sm font-semibold">👤 {username}</h1>
            <div className="ml-auto sm:hidden flex items-center pr-[1px]">
                <LogoutButton />
            </div>
        </div>
    )
}
