import { Button, Form, Input, TextField } from 'react-aria-components'
import { Controller } from 'react-hook-form'
import { useSendMessage } from '@frontend/queries/message'
import { useParams } from '@tanstack/react-router'

export const ChatInput = () => {
    const { onSubmit, form, mutation } = useSendMessage()
    const { receiverId } = useParams({ from: '/chat/$receiverId' })
    return (
        <Form onSubmit={onSubmit} className="flex p-2 gap-x-1">
            <Controller
                control={form.control}
                name="content"
                render={({ field: { name, value, onChange, onBlur, ref }, fieldState: { invalid } }) => (
                    <TextField
                        name={name}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        aria-labelledby="message-input"
                        isRequired
                        className="flex-1 group"
                        // Let React Hook Form handle validation instead of the browser.
                        validationBehavior="aria"
                        isInvalid={invalid}
                    >
                        <Input
                            ref={ref}
                            placeholder="Type a message..."
                            className={({ isInvalid }) =>
                                `w-full border-2 outline-none duration-200 rounded-md p-1.5 ${isInvalid ? 'border-red-500' : 'focus:border-black'}`
                            }
                        />
                    </TextField>
                )}
            />
            <input {...form.register('to_id', { value: Number(receiverId) })} className="hidden" />
            <Button
                isDisabled={mutation.isPending}
                type="submit"
                className="disabled:bg-black/80 bg-black rounded-md text-sm text-white py-2 font-semibold px-3"
            >
                Send
            </Button>
        </Form>
    )
}
