'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { deleteMessage, setMessageStatus } from '@/actions/library'
import { formatDate } from '@/lib/utils'
import type { ContactMessage } from '@/lib/types'

const STATUS_TONE: Record<string, string> = {
  new: 'Currently Learning',
  read: 'Foundational Knowledge',
  replied: 'Practical Exposure',
  archived: 'Basic Knowledge',
}

export function MessagesManager({ items }: { items: ContactMessage[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [deleting, setDeleting] = useState<ContactMessage | null>(null)

  function changeStatus(id: string, status: ContactMessage['status']) {
    startTransition(async () => {
      await setMessageStatus(id, status)
      router.refresh()
    })
  }

  function confirmDelete() {
    if (!deleting) return
    startTransition(async () => {
      await deleteMessage(deleting.id)
      setDeleting(null)
      router.refresh()
    })
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.1] px-4 py-16 text-center">
        <Mail size={24} className="mx-auto text-slate-600" />
        <p className="mt-3 text-[13px] text-slate-500">
          No enquiries yet. Messages submitted through the public contact form appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-[13px] text-slate-400">
        {items.length} message{items.length === 1 ? '' : 's'}. Status changes are saved instantly.
      </p>

      {items.map((message) => (
        <Card key={message.id} className="p-5" hover={false}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[14.5px] font-medium text-white">{message.name}</h3>
                <Badge tone={STATUS_TONE[message.status]}>{message.status}</Badge>
              </div>
              <p className="mt-1 text-[12px] text-slate-500">
                <a href={`mailto:${message.email}`} className="text-cyan-300/90 hover:text-cyan-200">
                  {message.email}
                </a>
                {message.company ? <span> · {message.company}</span> : null}
                <span> · {message.enquiry_type}</span>
              </p>
            </div>
            <span className="text-[11px] text-slate-600">{formatDate(message.created_at)}</span>
          </div>

          <p className="mt-3 text-[13.5px] font-medium text-slate-200">{message.subject}</p>
          <p className="mt-1.5 whitespace-pre-wrap text-[13px] leading-relaxed text-slate-400">
            {message.message}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-4">
            <select
              value={message.status}
              onChange={(event) =>
                changeStatus(message.id, event.target.value as ContactMessage['status'])
              }
              className="field w-36 py-1.5 text-[12px]"
              aria-label="Change message status"
            >
              <option value="new" className="bg-[#0b1220]">New</option>
              <option value="read" className="bg-[#0b1220]">Read</option>
              <option value="replied" className="bg-[#0b1220]">Replied</option>
              <option value="archived" className="bg-[#0b1220]">Archived</option>
            </select>
            <a
              href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-[12px] font-medium text-slate-300 hover:text-white"
            >
              Reply by email
            </a>
            <button
              type="button"
              onClick={() => setDeleting(message)}
              className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-[12px] font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </Card>
      ))}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this message?"
        message="The enquiry will be permanently removed from the database."
        pending={pending}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  )
}
