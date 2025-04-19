import { FC, MouseEvent, useState } from 'react'

interface SaveButtonProps {
  isPending?: boolean
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
}

export const SaveButton: FC<SaveButtonProps> = ({ isPending = false, onClick }) => {
  const [rippleStyle, setRippleStyle] = useState<{ left: number; top: number } | null>(null)

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setRippleStyle({ left: x, top: y })

    // Remove ripple after animation
    setTimeout(() => setRippleStyle(null), 600)

    // Call the provided onClick handler if it exists
    onClick?.(e)
  }

  return (
    <button
      type="submit"
      disabled={isPending}
      onClick={handleClick}
      className={`
        relative
        bg-blue-500 text-white px-6 py-3 rounded-lg
        hover:bg-blue-600 hover:shadow-lg
        active:bg-blue-700 active:shadow-md
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        group
        overflow-hidden
        active:scale-95
      `}
    >
      {rippleStyle && (
        <span
          className="absolute bg-white/30 rounded-full"
          style={{
            left: rippleStyle.left,
            top: rippleStyle.top,
            width: '0',
            height: '0',
            transform: 'translate(-50%, -50%)',
            animation: 'ripple 0.6s linear',
          }}
        />
      )}
      <span className={`flex items-center gap-2 ${isPending ? 'opacity-0' : 'opacity-100'}`}>
        Save Changes
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
          />
        </svg>
      </span>
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </button>
  )
} 