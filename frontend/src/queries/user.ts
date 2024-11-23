import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { UserValidators } from '@shared/validators'
import type { models } from '@backend/types'
import React from 'react'
import { fetcher } from './fetcher'

const getSessionQueryKey = () => ['session'] as const
export const useOptimisticUpdateSession = () => {
    const queryClient = useQueryClient()
    return React.useCallback(
        (data: models.Account) => {
            queryClient.setQueryData(getSessionQueryKey(), data)
        },
        [queryClient]
    )
}

export const useSession = () => {
    return useQuery({
        queryKey: getSessionQueryKey(),
        queryFn: async () => {
            const response = await fetcher('GET', '/api/session')
            if (!response.ok) {
                return null
            }
            return response.json() as Promise<models.Account>
        },
        retry: false,
    })
}

export const useLogin = (props?: { onSuccess?: (data: models.Account) => unknown }) => {
    const { onSuccess } = props ?? {}
    return useMutation({
        mutationFn: async (data: UserValidators.CreateUserSchema) => {
            const response = await fetcher('POST', '/api/login', {
                body: data,
            })

            return response.json() as Promise<models.Account>
        },
        onSuccess,
    })
}

export const useLogout = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async () => {
            const response = await fetcher('POST', '/api/logout')
            return response.json()
        },
        onSuccess: () => {
            queryClient.refetchQueries({
                queryKey: getSessionQueryKey(),
            })
        },
    })
}
export const getUsersQueryKey = () => ['users'] as const
export const useUsers = () => {
    return useSuspenseQuery({
        queryKey: getUsersQueryKey(),
        queryFn: async () => {
            const response = await fetcher('GET', '/api/user')
            return response.json() as Promise<models.Account[]>
        },
    })
}
