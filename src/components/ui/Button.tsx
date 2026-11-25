import Link from 'next/link'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 text-white shadow-[0_10px_30px_-10px_rgba(59,130,246,0.7)] hover:brightness-110',
  secondary:
    'border border-white/[0.12] bg-white/[0.04] text-slate-100 backdrop-blur hover:border-white/[0.24] hover:bg-white/[0.07]',
  ghost: 'text-slate-300 hover:bg-white/[0.05] hover:text-white',
  danger: 'border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[13px]',
  md: 'h-11 px-5 text-[14px]',
  lg: 'h-12 px-6 text-[15px]',
}

type Props = ComponentPropsWithoutRef<'button'> & {
  href?: string
  variant?: Variant
  size?: Size
  target?: string
  rel?: string
  children: ReactNode
}

export function Button({
  href,
  target,
  rel,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: Props) {
  const classes = cn(
    'inline-flex select-none items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  )

  if (href) {
    return (
      <Link href={href} className={classes} target={target} rel={rel}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
