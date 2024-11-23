import React from 'react'

export const useDebouncedCallback = <T extends (...args: unknown[]) => unknown>(cb: T, delay: number) => {
    const timeout = React.useRef<ReturnType<typeof setTimeout>>()
    const callback = React.useRef(cb)
    const debounced = React.useCallback(
        (...args: Parameters<T>) => {
            if (timeout.current) {
                clearTimeout(timeout.current)
            }
            timeout.current = setTimeout(() => {
                callback.current(...args)
            }, delay)
        },
        [delay]
    )
    return debounced
}
