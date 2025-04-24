import { FC, MouseEvent, useState } from 'react'
import styles from './RippleButton.module.css'

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isPending?: boolean
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  children?: React.ReactNode
}

const RippleButton: FC<RippleButtonProps> = ({ isPending = false, onClick, children, ...rest }) => {
  const [rippleStyle, setRippleStyle] = useState<{ left: number; top: number } | null>(null)

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setRippleStyle({ left: x, top: y })
    setTimeout(() => setRippleStyle(null), 600)
    onClick?.(e)
  }

  return (
    <button
      disabled={isPending}
      onClick={handleClick}
      className={styles.button}
      {...rest}
    >
      {rippleStyle && (
        <span
          className={styles.ripple}
          style={{
            left: rippleStyle.left,
            top: rippleStyle.top,
          }}
        />
      )}

      <span className={`${styles.content} ${isPending ? styles.contentHidden : ''}`}>
        {children || 'Submit'}
      </span>

      {isPending && (
        <div className={styles.spinner}>
          <div className={styles.spinnerInner} />
        </div>
      )}
    </button>
  )
}

export default RippleButton
