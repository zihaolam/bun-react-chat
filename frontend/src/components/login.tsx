import { UserValidators } from '@shared/validators'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField, Form, Label, FieldError, Input, Button } from 'react-aria-components'
import { useLogin, useOptimisticUpdateSession } from '@frontend/queries/user'

export const LoginComponent = () => {
    const { handleSubmit, control } = useForm<UserValidators.CreateUserSchema>({
        resolver: zodResolver(UserValidators.createUserValidator),
        defaultValues: {
            username: '',
        },
    })
    const setSession = useOptimisticUpdateSession()

    const {
        mutateAsync: onSubmit,
        isPending,
        reset,
    } = useLogin({
        onSuccess: data => {
            setSession(data)
            reset()
        },
    })

    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <Form
                onSubmit={handleSubmit(data => onSubmit(data))}
                className="sm:max-w-[400px] max-w-[80vw] w-full p-3 border shadow-lg rounded-md flex flex-col gap-y-3"
            >
                <Controller
                    control={control}
                    name="username"
                    render={({ field: { name, value, onChange, onBlur, ref }, fieldState: { invalid, error } }) => (
                        <TextField
                            name={name}
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            isRequired
                            className="flex flex-col gap-y-1.5"
                            // Let React Hook Form handle validation instead of the browser.
                            validationBehavior="aria"
                            isInvalid={invalid}
                        >
                            <Label className="font-medium">Username</Label>
                            <Input
                                data-invalid={invalid}
                                ref={ref}
                                className="border-2 outline-none duration-200 focus:ring-offset-black data-[invalid=true]:ring-offset-red ring-transparent focus:ring-black ring-[1px] focus:ring-offset-2 rounded-md p-1.5"
                            />
                            <FieldError>{error?.message}</FieldError>
                        </TextField>
                    )}
                />
                <Button
                    isDisabled={isPending}
                    type="submit"
                    className="disabled:bg-black/80 bg-black rounded-md text-white py-2 font-semibold"
                >
                    Login
                </Button>
            </Form>
        </div>
    )
}
