'use client'

import { useState, useTransition, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Briefcase, Loader2, Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { deleteExperience, saveExperience } from '@/actions/content'
import type { ActionResult, Experience } from '@/lib/types'

const EMPTY = {
  role: '',
  organization: '',
  location: '',
  duration: '',
  type: 'training' as 'internship' | 'training',
  description: '',
  technologies: [] as string[],
  sort_order: 0,
}

export function ExperienceManager({ items }: { items: Experience[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [result, setResult] = useState<ActionResult | null>(null)
  const [editing, setEditing] = useState<Experience | 'new' | null>(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [techInput, setTechInput] = useState('')
  const [deleting, setDeleting] = useState<Experience | null>(null)

  function openNew() {
    setForm({ ...EMPTY, technologies: [], sort_order: items.length + 1 })
    setTechInput('')
    setEditing('new')
    setResult(null)
  }

  function openEdit(item: Experience) {
    setForm({
      role: item.role,
      organization: item.organization,
      location: item.location ?? '',
      duration: item.duration ?? '',
      type: item.type,
      description: item.description ?? '',
      technologies: item.technologies ?? [],
      sort_order: item.sort_order,
    })
    setTechInput((item.technologies ?? []).join(', '))
    setEditing(item)
    setResult(null)
  }

  function addTechnologies() {
    const next = techInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
    setForm((current) => ({ ...current, technologies: Array.from(new Set([...current.technologies, ...next])) }))
    setTechInput('')
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setResult(null)
    startTransition(async () => {
      const response = await saveExperience({
        ...(editing !== 'new' && editing ? { id: editing.id } : {}),
        ...form,
      })
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
      const response = await deleteExperience(deleting.id)
      setResult(response)
      setDeleting(null)
      if (response.ok) router.refresh()
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] text-slate-400">
          Internships and training programmes — keep the description honest.
        </p>
        <Button onClick={openNew} size="sm">
          <Plus size={15} /> Add experience
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
              <Briefcase size={16} className="text-cyan-300" />
              {editing === 'new' ? 'Add experience' : 'Edit experience'}
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
              <label className="field-label">Role / programme name</label>
              <input
                className="field"
                value={form.role}
                onChange={(event) => setForm({ ...form, role: event.target.value })}
                required
              />
            </div>
            <div>
              <label className="field-label">Organisation</label>
              <input
                className="field"
                value={form.organization}
                onChange={(event) => setForm({ ...form, organization: event.target.value })}
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
                placeholder="e.g. Six months"
              />
            </div>
            <div>
              <label className="field-label">Type</label>
              <select
                className="field"
                value={form.type}
                onChange={(event) =>
                  setForm({ ...form, type: event.target.value as 'internship' | 'training' })
                }
              >
                <option value="internship" className="bg-[#0b1220]">Internship</option>
                <option value="training" className="bg-[#0b1220]">Training programme</option>
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
                rows={5}
                className="field resize-y"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">Technologies / topics</label>
              <div className="flex gap-2">
                <input
                  className="field"
                  value={techInput}
                  onChange={(event) => setTechInput(event.target.value)}
                  placeholder="Comma separated, e.g. Linux, Docker, CI/CD"
                />
                <Button type="button" variant="secondary" size="md" onClick={addTechnologies}>
                  Add
                </Button>
              </div>
              {form.technologies.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {form.technologies.map((tech) => (
                    <span key={tech} className="chip">
                      {tech}
                      <button
                        type="button"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            technologies: current.technologies.filter((item) => item !== tech),
                          }))
                        }
                        className="ml-1 text-slate-500 hover:text-red-300"
                        aria-label={`Remove ${tech}`}
                      >
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex gap-2 sm:col-span-2">
              <Button type="submit" disabled={pending} size="sm">
                {pending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {pending ? 'Saving…' : 'Save experience'}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id} className="p-5" hover={false}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[14.5px] font-medium text-white">{item.role}</h3>
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-slate-400">
                    {item.type === 'internship' ? 'Internship' : 'Training'}
                  </span>
                </div>
                <p className="mt-0.5 text-[12.5px] text-cyan-300/90">{item.organization}</p>
                <p className="mt-1 text-[11.5px] text-slate-500">
                  {[item.location, item.duration].filter(Boolean).join(' · ')}
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
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this experience record?"
        message={deleting ? `“${deleting.role}” will be removed from the public site immediately.` : ''}
        pending={pending}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  )
}
