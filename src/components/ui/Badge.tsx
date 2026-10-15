import type { PropsWithChildren } from 'react'

type BadgeProps = PropsWithChildren<{ tone?: 'neutral' | 'accent' | 'success' | 'danger' }>

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}
