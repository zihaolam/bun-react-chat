import { conversationRepo } from './conversation'
import { messageRepo } from './message'
import { userRepo } from './user'

export const repos = {
    conversation: conversationRepo,
    message: messageRepo,
    user: userRepo,
}
