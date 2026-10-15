import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  leadingIcon?: ReactNode
}

export function Button({ children, className = '', leadingIcon, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button className={`button button-${variant} ${className}`} type="button" {...props}>
      {leadingIcon}
      <span>{children}</span>
    </button>
  )
}
