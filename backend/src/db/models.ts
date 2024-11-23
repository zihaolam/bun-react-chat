export interface Message {
    id: string
    from_id: number
    to_id: number
    content: string
    sent_at: number // unix timestamp
}

export interface Conversation {
    id: string
    from_id: number
    to_id: number
    content: string
    from_username: string
    to_username: string
    sent_at: number
}

export interface Account {
    id: number
    username: string
}
