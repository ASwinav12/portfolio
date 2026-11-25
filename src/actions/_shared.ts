'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isOwnerEmail } from '@/lib/auth'

/**
 * Every admin server action calls this first.
 * The Supabase client carries the signed-in user's JWT, so Row Level Security
 * enforces the same ownership rule even if this check were bypassed.
 */
export async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isOwnerEmail(user.email)) {
    redirect('/admin/login')
  }

  return supabase
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
