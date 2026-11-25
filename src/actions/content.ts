'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/actions/_shared'
import { educationSchema, experienceSchema, trainingSchema } from '@/lib/validation'
import type { ActionResult } from '@/lib/types'

// ---------------------------------------------------------------------------
// Education
// ---------------------------------------------------------------------------
export async function saveEducation(input: unknown): Promise<ActionResult> {
  const supabase = await requireAdmin()
  const parsed = educationSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid education record.' }
  }

  const { id, ...rest } = parsed.data
  const { error } = id
    ? await supabase.from('education').update(rest).eq('id', id)
    : await supabase.from('education').insert(rest)

  if (error) return { ok: false, error: error.message }
  revalidatePath('/', 'layout')
  return { ok: true, message: 'Education saved.' }
}

export async function deleteEducation(id: string): Promise<ActionResult> {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('education').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/', 'layout')
  return { ok: true, message: 'Education deleted.' }
}

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------
export async function saveExperience(input: unknown): Promise<ActionResult> {
  const supabase = await requireAdmin()
  const parsed = experienceSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid experience record.' }
  }

  const { id, ...rest } = parsed.data
  const { error } = id
    ? await supabase.from('experience').update(rest).eq('id', id)
    : await supabase.from('experience').insert(rest)

  if (error) return { ok: false, error: error.message }
  revalidatePath('/', 'layout')
  return { ok: true, message: 'Experience saved.' }
}

export async function deleteExperience(id: string): Promise<ActionResult> {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('experience').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/', 'layout')
  return { ok: true, message: 'Experience deleted.' }
}

// ---------------------------------------------------------------------------
// Training modules
// ---------------------------------------------------------------------------
export async function saveTrainingModule(input: unknown): Promise<ActionResult> {
  const supabase = await requireAdmin()
  const parsed = trainingSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid training module.' }
  }

  const { id, ...rest } = parsed.data
  const { error } = id
    ? await supabase.from('training_modules').update(rest).eq('id', id)
    : await supabase.from('training_modules').insert(rest)

  if (error) return { ok: false, error: error.message }
  revalidatePath('/', 'layout')
  return { ok: true, message: 'Training module saved.' }
}

export async function deleteTrainingModule(id: string): Promise<ActionResult> {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('training_modules').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/', 'layout')
  return { ok: true, message: 'Training module deleted.' }
}
