import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

type IconButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & { label: string; variant?: 'default' | 'ghost' }
>

export function IconButton({ children, label, variant = 'default', className = '', ...props }: IconButtonProps) {
  const isComingSoon = ['Настройки', 'Поиск в чате', 'Дополнительные действия', 'Прикрепить файл', 'Добавить эмодзи'].includes(label)
  const accessibleLabel = isComingSoon ? `${label} — пока не работает` : label

  return (
    <button className={`icon-button ${variant === 'ghost' ? 'icon-button-ghost' : ''} ${isComingSoon ? 'icon-button-coming-soon' : ''} ${className}`} type="button" aria-label={accessibleLabel} {...props} disabled={isComingSoon || props.disabled}>
      {children}
    </button>
  )
}
