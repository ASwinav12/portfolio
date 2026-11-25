import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const LEVEL_STYLES: Record<string, string> = {
  'Practical Exposure': 'border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300',
  'Foundational Knowledge': 'border-brand-400/20 bg-brand-400/[0.08] text-brand-300',
  'Basic Knowledge': 'border-slate-400/20 bg-slate-400/[0.08] text-slate-300',
  'Currently Learning': 'border-violet-400/20 bg-violet-400/[0.08] text-violet-300',
}

export function Badge({
  children,
  tone,
  className,
}: {
  children: ReactNode
  tone?: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide',
        (tone && LEVEL_STYLES[tone]) || 'border-white/[0.1] bg-white/[0.04] text-slate-300',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function StatusDot({ level }: { level: string }) {
  const color =
    level === 'Practical Exposure'
      ? 'bg-emerald-400'
      : level === 'Foundational Knowledge'
        ? 'bg-brand-400'
        : level === 'Currently Learning'
          ? 'bg-violet-400'
          : 'bg-slate-400'
  return <span className={cn('h-1.5 w-1.5 rounded-full', color)} aria-hidden />
}
