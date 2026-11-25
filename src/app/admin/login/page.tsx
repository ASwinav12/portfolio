import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { LoginForm } from '@/components/admin/LoginForm'

export const metadata: Metadata = {
  title: 'Owner sign in',
  robots: { index: false, follow: false },
}

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#04060c] px-4 py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0" />
        <div className="absolute left-1/2 top-0 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-brand-600/[0.12] blur-[120px]" />
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
        <Suspense fallback={<div className="mx-auto h-[420px] w-full max-w-md rounded-2xl border border-white/[0.1] bg-[#0b1220]/90" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
