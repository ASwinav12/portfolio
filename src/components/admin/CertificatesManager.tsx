'use client'

import { useState, useTransition, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Award, Loader2, Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { FileUpload } from '@/components/admin/FileUpload'
import { deleteCertificate, saveCertificate } from '@/actions/library'
import { formatDate } from '@/lib/utils'
import type { ActionResult, Certificate } from '@/lib/types'

const EMPTY = {
  name: '',
  issuer: '',
  issue_date: '',
  credential_url: '',
  sort_order: 0,
}

export function CertificatesManager({ items }: { items: Certificate[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [result, setResult] = useState<ActionResult | null>(null)
  const [editing, setEditing] = useState<Certificate | 'new' | null>(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [file, setFile] = useState<{ path: string; type: 'pdf' | 'image' } | null>(null)
  const [deleting, setDeleting] = useState<Certificate | null>(null)

  function openNew() {
    setForm({ ...EMPTY, sort_order: items.length + 1 })
    setFile(null)
    setEditing('new')
    setResult(null)
  }

  function openEdit(item: Certificate) {
    setForm({
      name: item.name,
      issuer: item.issuer ?? '',
      issue_date: item.issue_date ?? '',
      credential_url: item.credential_url ?? '',
      sort_order: item.sort_order,
    })
    setFile(item.file_path && item.file_type ? { path: item.file_path, type: item.file_type } : null)
    setEditing(item)
    setResult(null)
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setResult(null)
    startTransition(async () => {
      const response = await saveCertificate(
        {
          ...(editing !== 'new' && editing ? { id: editing.id } : {}),
          ...form,
        },
        file,
      )
      setResult(response)
      if (response.ok) {
        setEditing(null)
        router.refresh()
      }
    })
  }

  function confirmDelete() {
    if (!deleting) return
    startTransition(async () => {
      const response = await deleteCertificate(deleting.id)
      setResult(response)
      setDeleting(null)
      if (response.ok) router.refresh()
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] text-slate-400">
          Add only certificates you have actually earned. The public section shows an empty state
          until then.
        </p>
        <Button onClick={openNew} size="sm">
          <Plus size={15} /> Add certificate
        </Button>
      </div>

      {result ? (
        <p className={`text-[12.5px] ${result.ok ? 'text-emerald-300' : 'text-red-400'}`}>
          {result.ok ? result.message : result.error}
        </p>
      ) : null}

      {editing ? (
        <Card className="p-6" hover={false}>
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[15px] font-medium text-white">
              <Award size={16} className="text-violet-300" />
              {editing === 'new' ? 'Add certificate' : 'Edit certificate'}
            </h2>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-md p-1.5 text-slate-500 hover:bg-white/[0.06] hover:text-white"
              aria-label="Close form"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={onSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Certificate name</label>
              <input
                className="field"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
            </div>
            <div>
              <label className="field-label">Issuing organisation</label>
              <input
                className="field"
                value={form.issuer}
                onChange={(event) => setForm({ ...form, issuer: event.target.value })}
              />
            </div>
            <div>
              <label className="field-label">Issue date</label>
              <input
                type="date"
                className="field"
                value={form.issue_date}
                onChange={(event) => setForm({ ...form, issue_date: event.target.value })}
              />
            </div>
            <div>
              <label className="field-label">Credential URL</label>
              <input
                className="field"
                value={form.credential_url}
                onChange={(event) => setForm({ ...form, credential_url: event.target.value })}
                placeholder="https://…"
              />
            </div>

            <div className="sm:col-span-2">
              <FileUpload
                bucket="documents"
                folder="certificates"
                label="Certificate file"
                hint="PDF or image · max 10 MB"
                accept="application/pdf,image/png,image/jpeg,image/webp"
                currentPath={file?.path ?? null}
                onUploaded={async (path) => {
                  const type = path.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image'
                  setFile({ path, type })
                }}
                onRemoved={async () => setFile(null)}
              />
            </div>

            <div className="sm:col-span-2 flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 text-[13px] text-slate-300">
                Sort order
                <input
                  type="number"
                  min={0}
                  className="field w-20"
                  value={form.sort_order}
                  onChange={(event) => setForm({ ...form, sort_order: Number(event.target.value) })}
                />
              </label>
            </div>

            <div className="flex gap-2 sm:col-span-2">
              <Button type="submit" disabled={pending} size="sm">
                {pending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {pending ? 'Saving…' : 'Save certificate'}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/[0.1] px-4 py-14 text-center">
            <Award size={24} className="mx-auto text-slate-600" />
            <p className="mt-3 text-[13px] text-slate-500">No certificates added yet.</p>
          </div>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="p-5" hover={false}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-[14.5px] font-medium text-white">{item.name}</h3>
                  {item.issuer ? (
                    <p className="mt-0.5 text-[12.5px] text-violet-300/90">{item.issuer}</p>
                  ) : null}
                  <p className="mt-1 text-[11.5px] text-slate-500">
                    {[item.issue_date ? formatDate(item.issue_date) : null, item.file_type?.toUpperCase()].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-2 text-slate-400 hover:text-white"
                    aria-label="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(item)}
                    className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-300"
                    aria-label="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this certificate?"
        message={deleting ? `“${deleting.name}” and its uploaded file will be removed.` : ''}
        pending={pending}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  )
}
