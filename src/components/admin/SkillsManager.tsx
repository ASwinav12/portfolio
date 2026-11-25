'use client'

import { useMemo, useState, useTransition, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { StatusDot } from '@/components/ui/Badge'
import { deleteSkill, saveSkill } from '@/actions/library'
import type { ActionResult, Skill } from '@/lib/types'

const LEVELS = [
  'Practical Exposure',
  'Foundational Knowledge',
  'Basic Knowledge',
  'Currently Learning',
]

const EMPTY = { name: '', category: '', level: 'Foundational Knowledge', sort_order: 0 }

export function SkillsManager({ items }: { items: Skill[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [result, setResult] = useState<ActionResult | null>(null)
  const [editing, setEditing] = useState<Skill | 'new' | null>(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [deleting, setDeleting] = useState<Skill | null>(null)

  const categories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category))),
    [items],
  )

  const grouped = useMemo(
    () =>
      categories.map((category) => ({
        category,
        skills: items.filter((item) => item.category === category),
      })),
    [categories, items],
  )

  function openNew() {
    setForm({ ...EMPTY, category: categories[0] ?? '', sort_order: items.length + 1 })
    setEditing('new')
    setResult(null)
  }

  function openEdit(skill: Skill) {
    setForm({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      sort_order: skill.sort_order,
    })
    setEditing(skill)
    setResult(null)
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setResult(null)
    startTransition(async () => {
      const response = await saveSkill({
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
      const response = await deleteSkill(deleting.id)
      setResult(response)
      setDeleting(null)
      if (response.ok) router.refresh()
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] text-slate-400">
          {items.length} skills in {categories.length} categories. Keep the proficiency labels
          honest.
        </p>
        <Button onClick={openNew} size="sm">
          <Plus size={15} /> Add skill
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
            <h2 className="text-[15px] font-medium text-white">
              {editing === 'new' ? 'Add skill' : 'Edit skill'}
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
              <label className="field-label">Skill name</label>
              <input
                className="field"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
            </div>
            <div>
              <label className="field-label">Category</label>
              <input
                className="field"
                list="skill-categories"
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
                required
              />
              <datalist id="skill-categories">
                {categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="field-label">Proficiency</label>
              <select
                className="field"
                value={form.level}
                onChange={(event) => setForm({ ...form, level: event.target.value })}
              >
                {LEVELS.map((level) => (
                  <option key={level} value={level} className="bg-[#0b1220]">
                    {level}
                  </option>
                ))}
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
            <div className="flex gap-2 sm:col-span-2">
              <Button type="submit" disabled={pending} size="sm">
                {pending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {pending ? 'Saving…' : 'Save skill'}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      <div className="space-y-4">
        {grouped.map((group) => (
          <Card key={group.category} className="p-5" hover={false}>
            <h3 className="text-[13.5px] font-medium text-white">
              {group.category}
              <span className="ml-2 text-[11px] font-normal text-slate-500">
                {group.skills.length}
              </span>
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="group inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.025] py-1 pl-2.5 pr-1.5 text-[12.5px] text-slate-300"
                >
                  <StatusDot level={skill.level} />
                  {skill.name}
                  <span className="text-[10px] text-slate-600">{skill.level}</span>
                  <span className="ml-1 flex items-center">
                    <button
                      type="button"
                      onClick={() => openEdit(skill)}
                      className="rounded p-1 text-slate-500 hover:text-white"
                      aria-label={`Edit ${skill.name}`}
                    >
                      <Pencil size={11} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(skill)}
                      className="rounded p-1 text-slate-500 hover:text-red-300"
                      aria-label={`Delete ${skill.name}`}
                    >
                      <Trash2 size={11} />
                    </button>
                  </span>
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this skill?"
        message={deleting ? `“${deleting.name}” will be removed from the public site.` : ''}
        pending={pending}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  )
}
