'use client'

import { useState, useTransition, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ExternalLink, FolderGit2, Loader2, Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { FileUpload } from '@/components/admin/FileUpload'
import { deleteProject, saveProject } from '@/actions/library'
import { slugify } from '@/lib/utils'
import { storageUrl } from '@/lib/storage'
import type { ActionResult, Project } from '@/lib/types'

const EMPTY = {
  title: '',
  slug: '',
  summary: '',
  description: '',
  tech_stack: [] as string[],
  github_url: '',
  live_url: '',
  image_path: null as string | null,
  featured: false,
  sort_order: 0,
}

export function ProjectsManager({ items }: { items: Project[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [result, setResult] = useState<ActionResult | null>(null)
  const [editing, setEditing] = useState<Project | 'new' | null>(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [techInput, setTechInput] = useState('')
  const [deleting, setDeleting] = useState<Project | null>(null)

  function openNew() {
    setForm({ ...EMPTY, tech_stack: [], sort_order: items.length + 1 })
    setTechInput('')
    setEditing('new')
    setResult(null)
  }

  function openEdit(project: Project) {
    setForm({
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      description: project.description ?? '',
      tech_stack: project.tech_stack ?? [],
      github_url: project.github_url ?? '',
      live_url: project.live_url ?? '',
      image_path: project.image_path,
      featured: project.featured,
      sort_order: project.sort_order,
    })
    setTechInput((project.tech_stack ?? []).join(', '))
    setEditing(project)
    setResult(null)
  }

  function addTech() {
    const next = techInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
    setForm((current) => ({ ...current, tech_stack: Array.from(new Set([...current.tech_stack, ...next])) }))
    setTechInput('')
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setResult(null)
    startTransition(async () => {
      const response = await saveProject({
        ...(editing !== 'new' && editing ? { id: editing.id } : {}),
        ...form,
        slug: form.slug || slugify(form.title),
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
      const response = await deleteProject(deleting.id)
      setResult(response)
      setDeleting(null)
      if (response.ok) router.refresh()
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] text-slate-400">
          {items.length} project{items.length === 1 ? '' : 's'} published. Only add real work with
          working links.
        </p>
        <Button onClick={openNew} size="sm">
          <Plus size={15} /> Add project
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
              <FolderGit2 size={16} className="text-cyan-300" />
              {editing === 'new' ? 'Add project' : 'Edit project'}
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
              <label className="field-label">Slug</label>
              <input
                className="field"
                value={form.slug}
                onChange={(event) => setForm({ ...form, slug: event.target.value })}
                placeholder="auto-generated from the title"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="field-label">Short summary</label>
              <textarea
                rows={2}
                className="field resize-y"
                value={form.summary}
                onChange={(event) => setForm({ ...form, summary: event.target.value })}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="field-label">Full description</label>
              <textarea
                rows={5}
                className="field resize-y"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="field-label">Tech stack</label>
              <div className="flex gap-2">
                <input
                  className="field"
                  value={techInput}
                  onChange={(event) => setTechInput(event.target.value)}
                  placeholder="Comma separated, e.g. Docker, Jenkins, AWS"
                />
                <Button type="button" variant="secondary" onClick={addTech}>
                  Add
                </Button>
              </div>
              {form.tech_stack.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {form.tech_stack.map((tech) => (
                    <span key={tech} className="chip">
                      {tech}
                      <button
                        type="button"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            tech_stack: current.tech_stack.filter((item) => item !== tech),
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

            <div>
              <label className="field-label">GitHub repository URL</label>
              <input
                className="field"
                value={form.github_url}
                onChange={(event) => setForm({ ...form, github_url: event.target.value })}
                placeholder="https://github.com/…"
              />
            </div>
            <div>
              <label className="field-label">Live demo URL</label>
              <input
                className="field"
                value={form.live_url}
                onChange={(event) => setForm({ ...form, live_url: event.target.value })}
                placeholder="https://…"
              />
            </div>

            <div className="sm:col-span-2">
              <FileUpload
                bucket="images"
                folder="projects"
                label="Project screenshot"
                hint="PNG or JPG · compressed automatically"
                image
                currentPath={form.image_path}
                onUploaded={async (path) => setForm((current) => ({ ...current, image_path: path }))}
                onRemoved={async () => setForm((current) => ({ ...current, image_path: null }))}
              />
            </div>

            <div className="sm:col-span-2 flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 text-[13px] text-slate-300">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) => setForm({ ...form, featured: event.target.checked })}
                  className="h-4 w-4 rounded border-white/20 bg-white/5 accent-cyan-400"
                />
                Featured project
              </label>
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
                {pending ? 'Saving…' : 'Save project'}
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
            <FolderGit2 size={24} className="mx-auto text-slate-600" />
            <p className="mt-3 text-[13px] text-slate-500">
              No projects yet — the public site shows a clean empty state.
            </p>
          </div>
        ) : (
          items.map((project) => {
            const image = storageUrl('images', project.image_path)
            return (
              <Card key={project.id} className="flex gap-4 p-4" hover={false}>
                <div className="hidden h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-white/[0.08] bg-[#080d18] sm:block">
                  {image ? (
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-700">
                      <FolderGit2 size={18} />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[14.5px] font-medium text-white">{project.title}</h3>
                  <p className="mt-0.5 line-clamp-2 text-[12.5px] text-slate-400">{project.summary}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
                    {project.github_url ? <span className="inline-flex items-center gap-1"><ExternalLink size={11} /> GitHub</span> : null}
                    {project.live_url ? <span className="inline-flex items-center gap-1"><ExternalLink size={11} /> Live</span> : null}
                    {project.featured ? <span className="text-cyan-300">Featured</span> : null}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEdit(project)}
                    className="rounded-md border border-white/[0.08] bg-white/[0.03] p-2 text-slate-400 hover:text-white"
                    aria-label="Edit"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(project)}
                    className="rounded-md border border-white/[0.08] bg-white/[0.03] p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-300"
                    aria-label="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </Card>
            )
          })
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this project?"
        message={deleting ? `“${deleting.title}” and its screenshot will be removed permanently.` : ''}
        pending={pending}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  )
}
