import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { SetupForm } from '@/components/admin/SetupForm'
import { OWNER_EMAIL } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Create owner account',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function AdminSetupPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Already signed in — nothing to set up.
  if (user) redirect('/admin')

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#04060c] px-4 py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0" />
        <div className="absolute left-1/2 top-0 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-emerald-500/[0.08] blur-[120px]" />
      </div>

      <div className="relative w-full">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-500/40 bg-brand-500/10 font-mono text-[12px] font-semibold text-cyan-300">
              {'</>'}
            </span>
            <span className="text-[15px] font-semibold tracking-[0.06em] text-white">
              ASWIN A V
            </span>
          </Link>
        </div>
        <SetupForm ownerEmail={OWNER_EMAIL} />
      </div>
    </div>
  )
}
