import { authMiddleware } from '@backend/middleware/auth'
import { handleGetConversationMessages, handleGetConversations, handleInsertMessage } from './message'
import { handleGetSession, handleGetUsers, handleLogin, handleLogout } from './user'

export type HTTP_METHODS = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type SUPPORTED_HTTP_METHODS = 'GET' | 'POST' // Add more methods as needed

// TODO: setup typesafe validators and response types
export const ROUTES = {
    GET: {
        'api/conversation/me': {
            handler: authMiddleware(handleGetConversations),
        },
        'api/conversation/message': {
            handler: authMiddleware(handleGetConversationMessages),
        },
        'api/session': {
            handler: authMiddleware(handleGetSession),
        },
        'api/user': {
            handler: handleGetUsers,
        },
    },
    POST: {
        'api/login': {
            handler: handleLogin,
        },
        'api/logout': {
            handler: handleLogout,
        },
        'api/message': {
            handler: authMiddleware(handleInsertMessage),
        },
    },
}

export type Routes = typeof ROUTES
