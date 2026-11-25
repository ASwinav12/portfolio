import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  hover?: boolean
}

export function Card({ children, className, hover = true, ...rest }: Props) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.045] to-white/[0.015] p-6 shadow-card backdrop-blur-sm',
        hover && 'card-hover',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
