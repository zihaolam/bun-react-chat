interface TypewriterProps {
    content: string
}

export const Typewriter = ({ content }: TypewriterProps) => {
    return (
        <div className="relative w-[max-content] font-mono before:absolute before:inset-0 before:animate-typewriter before:bg-white after:absolute after:inset-0 after:w-[0.125em] after:animate-caret after:bg-black">
            {content}
        </div>
    )
}
