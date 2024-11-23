import { InfiniteData, useMutation, useQueryClient, useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { fetcher } from './fetcher'
import { models } from '@backend/db'
import { Page } from '@backend/lib/pagination'
import { MessageValidators } from '@shared/validators'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useSession } from './user'

export const getConversationQueryKey = () => ['conversations']

export const useRefetchMyConversations = () => {
    const queryClient = useQueryClient()
    return React.useCallback(() => {
        queryClient.refetchQueries({ queryKey: getConversationQueryKey() })
    }, [queryClient])
}
export const useMyConversations = () => {
    return useSuspenseInfiniteQuery({
        queryKey: getConversationQueryKey(),
        queryFn: async ({ pageParam }) => {
            const response = await fetcher('GET', `/api/conversation/me`, {
                filters: {
                    cursor: pageParam,
                    limit: 20,
                },
            })
            return response.json() as Promise<Page<models.Conversation, string>>
        },
        getNextPageParam: lastPage => {
            return lastPage.hasNextPage ? lastPage.cursor : undefined
        },
        initialPageParam: null as string | null,
    })
}

export const getConversationMessageQueryKey = (receiverId: number) => ['conversation-messages', receiverId]
export const useConversationMessage = (receiverId: number | undefined) => {
    return useSuspenseInfiniteQuery({
        // quick hack, we can use 0 as a fallback since account_ids start from 1
        queryKey: React.useMemo(() => getConversationMessageQueryKey(receiverId ?? 0), [receiverId]),
        queryFn: async ({ pageParam }) => {
            const response = await fetcher('GET', `/api/conversation/message`, {
                filters: {
                    cursor: pageParam,
                    limit: 20,
                    to_id: receiverId ?? 0,
                } satisfies MessageValidators.GetConversationMessagesSchema,
            })
            return response.json() as Promise<Page<models.Message, string>>
        },
        getNextPageParam: lastPage => {
            return lastPage.hasNextPage ? lastPage.cursor : undefined
        },
        initialPageParam: null as string | null,
    })
}

export const useOptimisticUpdateConversationMessage = () => {
    const queryClient = useQueryClient()
    return React.useCallback(
        (data: models.Message, myUserId: number) => {
            const receiverId = myUserId === data.to_id ? data.from_id : data.to_id
            queryClient.setQueryData<InfiniteData<Page<models.Message, string> | undefined>>(
                getConversationMessageQueryKey(receiverId),
                old => {
                    if (!old) {
                        return {
                            pageParams: [data.id],
                            pages: [
                                {
                                    items: [data],
                                    cursor: data.id,
                                    hasNextPage: false,
                                },
                            ],
                        }
                    }
                    return {
                        // for simplicity, just make a new page whenever there is optimistic updates
                        pageParams: [data.id, ...old.pageParams],
                        pages: [
                            {
                                items: [data],
                                cursor: data.id,
                                hasNextPage: false,
                            },
                            ...old.pages,
                        ],
                    }
                }
            )
        },
        [queryClient]
    )
}

export const useSendMessage = () => {
    const updateConversationMessage = useOptimisticUpdateConversationMessage()
    const { data: session } = useSession()
    const form = useForm<MessageValidators.InsertMessageSchema>({
        resolver: zodResolver(MessageValidators.insertMessageValidator),
        defaultValues: {
            content: '',
        },
    })
    const refetchMyConversations = useRefetchMyConversations()

    const mutation = useMutation({
        mutationFn: async (data: MessageValidators.InsertMessageSchema) => {
            const response = await fetcher('POST', `/api/message`, { body: data })
            return response.json() as Promise<models.Message>
        },
        onSuccess: msg => {
            form.setValue('content', '')
            form.setFocus('content')
            if (!session) return
            updateConversationMessage(msg, session?.id)

            // TODO: do optimistic update to optimise not refetching the whole conversation list
            refetchMyConversations()
        },
    })

    const onSubmit = form.handleSubmit(async data => {
        return mutation.mutateAsync(data)
    })

    return {
        form,
        onSubmit,
        mutation,
    }
}
