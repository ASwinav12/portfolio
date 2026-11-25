'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  pending,
  onConfirm,
  onClose,
}: {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  pending?: boolean
  onConfirm: () => void
  onClose: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-white/[0.1] bg-[#0b1220] p-6 shadow-2xl">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/25 bg-red-500/10 text-red-300">
          <AlertTriangle size={20} />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-white">{title}</h2>
        <p className="mt-2 text-[13.5px] leading-relaxed text-slate-400">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={pending}>
            {pending ? <Loader2 size={15} className="animate-spin" /> : null}
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
