import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ChatInput, ChatMessageList, ChatTitleBar } from '@frontend/components/chat'
import { Suspense } from 'react'
import { Typewriter } from '@frontend/components/typewriter'
import { fetcher } from '@frontend/queries/fetcher'
import type { models } from '@backend/db'

export const Route = createFileRoute('/chat/$receiverId')({
    component: RouteComponent,
    loader: async ({ params }) => {
        const res = await fetcher('GET', '/api/user/:userId', {
            filters: {
                userId: Number(params.receiverId),
            },
        })
        return res.json() as Promise<models.Account | null>
    },
})

function RouteComponent() {
    const data: models.Account | null = Route.useLoaderData() // not sure why type is not auto inferred, still need casting for now

    return (
        <div className="flex-1 h-screen flex flex-col">
            <ChatTitleBar username={data?.username} />
            <Suspense
                fallback={
                    <div className="w-full h-full flex items-center justify-center">
                        <Typewriter content="Loading messages..." />
                    </div>
                }
            >
                <ChatMessageList />
            </Suspense>
            <ChatInput />
        </div>
    )
}
