'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/actions/_shared'
import { certificateSchema, projectSchema, skillSchema } from '@/lib/validation'
import type { ActionResult } from '@/lib/types'

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------
export async function saveSkill(input: unknown): Promise<ActionResult> {
  const supabase = await requireAdmin()
  const parsed = skillSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid skill.' }
  }

  const { id, ...rest } = parsed.data
  const { error } = id
    ? await supabase.from('skills').update(rest).eq('id', id)
    : await supabase.from('skills').insert(rest)

  if (error) return { ok: false, error: error.message }
  revalidatePath('/', 'layout')
  return { ok: true, message: 'Skill saved.' }
}

export async function deleteSkill(id: string): Promise<ActionResult> {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('skills').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/', 'layout')
  return { ok: true, message: 'Skill deleted.' }
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
export async function saveProject(input: unknown): Promise<ActionResult> {
  const supabase = await requireAdmin()
  const parsed = projectSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid project.' }
  }

  const { id, ...rest } = parsed.data
  const payload = {
    ...rest,
    github_url: rest.github_url || null,
    live_url: rest.live_url || null,
    description: rest.description || null,
    image_path: rest.image_path ?? null,
  }

  const { error } = id
    ? await supabase.from('projects').update(payload).eq('id', id)
    : await supabase.from('projects').insert(payload)

  if (error) return { ok: false, error: error.message }
  revalidatePath('/', 'layout')
  return { ok: true, message: 'Project saved.' }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const supabase = await requireAdmin()

  const { data: project } = await supabase
    .from('projects')
    .select('image_path')
    .eq('id', id)
    .maybeSingle()

  if (project?.image_path) {
    await supabase.storage.from('images').remove([project.image_path])
  }

  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/', 'layout')
  return { ok: true, message: 'Project deleted.' }
}

// ---------------------------------------------------------------------------
// Certificates
// ---------------------------------------------------------------------------
export async function saveCertificate(
  input: unknown,
  file?: { path: string; type: 'pdf' | 'image' } | null,
): Promise<ActionResult> {
  const supabase = await requireAdmin()
  const parsed = certificateSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid certificate.' }
  }

  const { id, ...rest } = parsed.data
  const payload = {
    ...rest,
    issuer: rest.issuer || null,
    issue_date: rest.issue_date || null,
    credential_url: rest.credential_url || null,
    ...(file ? { file_path: file.path, file_type: file.type } : {}),
  }

  const { error } = id
    ? await supabase.from('certificates').update(payload).eq('id', id)
    : await supabase.from('certificates').insert({
        ...payload,
        file_path: file?.path ?? null,
        file_type: file?.type ?? null,
      })

  if (error) return { ok: false, error: error.message }
  revalidatePath('/', 'layout')
  return { ok: true, message: 'Certificate saved.' }
}

export async function deleteCertificate(id: string): Promise<ActionResult> {
  const supabase = await requireAdmin()

  const { data: certificate } = await supabase
    .from('certificates')
    .select('file_path')
    .eq('id', id)
    .maybeSingle()

  if (certificate?.file_path) {
    await supabase.storage.from('documents').remove([certificate.file_path])
  }

  const { error } = await supabase.from('certificates').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/', 'layout')
  return { ok: true, message: 'Certificate deleted.' }
}

// ---------------------------------------------------------------------------
// Contact messages
// ---------------------------------------------------------------------------
export async function setMessageStatus(
  id: string,
  status: 'new' | 'read' | 'replied' | 'archived',
): Promise<ActionResult> {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('contact_messages').update({ status }).eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/admin/messages')
  return { ok: true, message: 'Message updated.' }
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('contact_messages').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/admin/messages')
  return { ok: true, message: 'Message deleted.' }
}
