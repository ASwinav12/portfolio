'use client'

import { useState, useTransition, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { GraduationCap, Loader2, Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { deleteEducation, saveEducation } from '@/actions/content'
import type { ActionResult, Education } from '@/lib/types'

const EMPTY = {
  degree: '',
  institution: '',
  location: '',
  duration: '',
  status: 'Completed',
  description: '',
  sort_order: 0,
}

export function EducationManager({ items }: { items: Education[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [result, setResult] = useState<ActionResult | null>(null)
  const [editing, setEditing] = useState<Education | 'new' | null>(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [deleting, setDeleting] = useState<Education | null>(null)

  function openNew() {
    setForm({ ...EMPTY, sort_order: items.length + 1 })
    setEditing('new')
    setResult(null)
  }

  function openEdit(item: Education) {
    setForm({
      degree: item.degree,
      institution: item.institution,
      location: item.location ?? '',
      duration: item.duration ?? '',
      status: item.status,
      description: item.description ?? '',
      sort_order: item.sort_order,
    })
    setEditing(item)
    setResult(null)
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setResult(null)
    startTransition(async () => {
      const response = await saveEducation({ ...(editing !== 'new' && editing ? { id: editing.id } : {}), ...form })
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
      const response = await deleteEducation(deleting.id)
      setResult(response)
      setDeleting(null)
      if (response.ok) router.refresh()
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] text-slate-400">
          {items.length} record{items.length === 1 ? '' : 's'} shown in this order.
        </p>
        <Button onClick={openNew} size="sm">
          <Plus size={15} /> Add education
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
              <GraduationCap size={16} className="text-cyan-300" />
              {editing === 'new' ? 'Add education' : 'Edit education'}
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
              <label className="field-label">Degree / programme</label>
              <input
                className="field"
                value={form.degree}
                onChange={(event) => setForm({ ...form, degree: event.target.value })}
                required
              />
            </div>
            <div>
              <label className="field-label">Institution</label>
              <input
                className="field"
                value={form.institution}
                onChange={(event) => setForm({ ...form, institution: event.target.value })}
                required
              />
            </div>
            <div>
              <label className="field-label">Location</label>
              <input
                className="field"
                value={form.location}
                onChange={(event) => setForm({ ...form, location: event.target.value })}
              />
            </div>
            <div>
              <label className="field-label">Duration</label>
              <input
                className="field"
                value={form.duration}
                onChange={(event) => setForm({ ...form, duration: event.target.value })}
                placeholder="e.g. Three-year diploma"
              />
            </div>
            <div>
              <label className="field-label">Status</label>
              <select
                className="field"
                value={form.status}
                onChange={(event) => setForm({ ...form, status: event.target.value })}
              >
                <option value="Completed" className="bg-[#0b1220]">Completed</option>
                <option value="Currently Pursuing" className="bg-[#0b1220]">Currently Pursuing</option>
                <option value="Discontinued" className="bg-[#0b1220]">Discontinued</option>
              </select>
            </div>
            <div>
              <label className="field-label">Sort order</label>
              <input
                type="number"
                min={0}
                className="field"
                value={form.sort_order}
                onChange={(event) => setForm({ ...form, sort_order: Number(event.target.value) })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">Description</label>
              <textarea
                rows={4}
                className="field resize-y"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
            </div>

            <div className="flex gap-2 sm:col-span-2">
              <Button type="submit" disabled={pending} size="sm">
                {pending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {pending ? 'Saving…' : 'Save education'}
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
          <div className="rounded-2xl border border-dashed border-white/[0.1] px-4 py-12 text-center text-[13px] text-slate-500">
            No education records yet.
          </div>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="p-5" hover={false}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-[14.5px] font-medium text-white">{item.degree}</h3>
                  <p className="mt-0.5 text-[12.5px] text-cyan-300/90">{item.institution}</p>
                  <p className="mt-1 text-[11.5px] text-slate-500">
                    {[item.location, item.duration].filter(Boolean).join(' · ')}
                    {item.location || item.duration ? ' · ' : ''}
                    {item.status}
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
        title="Delete this education record?"
        message={deleting ? `“${deleting.degree}” will be removed from the public site immediately.` : ''}
        pending={pending}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  )
}
