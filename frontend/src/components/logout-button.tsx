import { useLogout } from '@frontend/queries/user'
import { Button, ButtonProps } from 'react-aria-components'

export const LogoutButton = ({ className, ...props }: ButtonProps) => {
    const { mutate, isPending } = useLogout()
    return (
        <Button
            className={({ isDisabled }) => `font-medium text-xs ${isDisabled ? 'text-black/50' : ''} ${className}`}
            {...props}
            isDisabled={isPending}
            onPress={() => mutate()}
        >
            Logout
        </Button>
    )
}
