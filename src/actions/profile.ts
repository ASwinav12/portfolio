'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/actions/_shared'
import { profileSchema } from '@/lib/validation'
import type { ActionResult } from '@/lib/types'

export async function updateProfile(input: unknown): Promise<ActionResult> {
  const supabase = await requireAdmin()
  const parsed = profileSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid profile data.' }
  }

  const data = parsed.data
  const { data: existing } = await supabase.from('profile').select('id').limit(1).maybeSingle()
  if (!existing) return { ok: false, error: 'Profile record not found.' }

  const { error } = await supabase
    .from('profile')
    .update({
      full_name: data.full_name,
      headline: data.headline,
      about: data.about,
      email: data.email,
      phone: data.phone,
      location: data.location,
      availability: data.availability,
      socials: {
        github: data.github,
        linkedin: data.linkedin,
        instagram: data.instagram,
      },
      updated_at: new Date().toISOString(),
    })
    .eq('id', existing.id)

  if (error) return { ok: false, error: error.message }

  revalidatePath('/', 'layout')
  return { ok: true, message: 'Profile updated.' }
}

/** Sets (or clears) the profile photo after a client-side storage upload. */
export async function setProfilePhoto(path: string | null): Promise<ActionResult> {
  const supabase = await requireAdmin()

  const { data: existing } = await supabase
    .from('profile')
    .select('id, photo_path')
    .limit(1)
    .maybeSingle()

  if (!existing) return { ok: false, error: 'Profile record not found.' }

  if (!path && existing.photo_path) {
    await supabase.storage.from('images').remove([existing.photo_path])
  }

  const { error } = await supabase
    .from('profile')
    .update({ photo_path: path, updated_at: new Date().toISOString() })
    .eq('id', existing.id)

  if (error) return { ok: false, error: error.message }

  revalidatePath('/', 'layout')
  return { ok: true, message: path ? 'Profile photo updated.' : 'Profile photo removed.' }
}

/** Sets (or clears) the resume PDF after a client-side storage upload. */
export async function setResume(path: string | null, label?: string): Promise<ActionResult> {
  const supabase = await requireAdmin()

  const { data: existing } = await supabase
    .from('profile')
    .select('id, resume_path')
    .limit(1)
    .maybeSingle()

  if (!existing) return { ok: false, error: 'Profile record not found.' }

  if (!path && existing.resume_path) {
    await supabase.storage.from('documents').remove([existing.resume_path])
  }

  const { error } = await supabase
    .from('profile')
    .update({
      resume_path: path,
      resume_label: path ? (label || 'Resume') : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', existing.id)

  if (error) return { ok: false, error: error.message }

  revalidatePath('/', 'layout')
  return { ok: true, message: path ? 'Resume updated.' : 'Resume removed.' }
}
