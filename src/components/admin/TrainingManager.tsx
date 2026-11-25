'use client'

import { useState, useTransition, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Pencil, Plus, Save, Terminal, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { deleteTrainingModule, saveTrainingModule } from '@/actions/content'
import type { ActionResult, TrainingModule } from '@/lib/types'

const EMPTY = { title: '', description: '', topics: [] as string[], sort_order: 0 }

export function TrainingManager({ items }: { items: TrainingModule[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [result, setResult] = useState<ActionResult | null>(null)
  const [editing, setEditing] = useState<TrainingModule | 'new' | null>(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [topicInput, setTopicInput] = useState('')
  const [deleting, setDeleting] = useState<TrainingModule | null>(null)

  function openNew() {
    setForm({ ...EMPTY, topics: [], sort_order: items.length + 1 })
    setTopicInput('')
    setEditing('new')
    setResult(null)
  }

  function openEdit(item: TrainingModule) {
    setForm({
      title: item.title,
      description: item.description ?? '',
      topics: item.topics ?? [],
      sort_order: item.sort_order,
    })
    setTopicInput('')
    setEditing(item)
    setResult(null)
  }

  function addTopics() {
    const next = topicInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
    setForm((current) => ({ ...current, topics: Array.from(new Set([...current.topics, ...next])) }))
    setTopicInput('')
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setResult(null)
    startTransition(async () => {
      const response = await saveTrainingModule({
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
      const response = await deleteTrainingModule(deleting.id)
      setResult(response)
      setDeleting(null)
      if (response.ok) router.refresh()
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] text-slate-400">
          {items.length} modules shown in the DevOps &amp; Cloud Training section.
        </p>
        <Button onClick={openNew} size="sm">
          <Plus size={15} /> Add module
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
              <Terminal size={16} className="text-cyan-300" />
              {editing === 'new' ? 'Add training module' : 'Edit training module'}
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
              <label className="field-label">Title</label>
              <input
                className="field"
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                required
              />
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
                rows={3}
                className="field resize-y"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">Topics</label>
              <div className="flex gap-2">
                <input
                  className="field"
                  value={topicInput}
                  onChange={(event) => setTopicInput(event.target.value)}
                  placeholder="Comma separated, e.g. Pods, Deployments"
                />
                <Button type="button" variant="secondary" onClick={addTopics}>
                  Add
                </Button>
              </div>
              {form.topics.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {form.topics.map((topic) => (
                    <span key={topic} className="chip">
                      {topic}
                      <button
                        type="button"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            topics: current.topics.filter((item) => item !== topic),
                          }))
                        }
                        className="ml-1 text-slate-500 hover:text-red-300"
                        aria-label={`Remove ${topic}`}
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
                {pending ? 'Saving…' : 'Save module'}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <Card key={item.id} className="p-4" hover={false}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-[13.5px] font-medium text-white">{item.title}</h3>
                {item.description ? (
                  <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-slate-500">
                    {item.description}
                  </p>
                ) : null}
                {item.topics.length > 0 ? (
                  <p className="mt-2 text-[10.5px] text-slate-600">
                    {item.topics.join(' · ')}
                  </p>
                ) : null}
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="rounded-md p-1.5 text-slate-500 hover:bg-white/[0.06] hover:text-white"
                  aria-label="Edit"
                >
                  <Pencil size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleting(item)}
                  className="rounded-md p-1.5 text-slate-500 hover:bg-red-500/10 hover:text-red-300"
                  aria-label="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this training module?"
        message={deleting ? `“${deleting.title}” will be removed from the public site.` : ''}
        pending={pending}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  )
}
