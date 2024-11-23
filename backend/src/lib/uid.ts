import { randomUUID } from 'crypto'

// timestamp + randomUUID to generate a time-sortable uuid
export const uid = (prefix = '') => {
    return prefix + '_' + Date.now() + randomUUID()
}
