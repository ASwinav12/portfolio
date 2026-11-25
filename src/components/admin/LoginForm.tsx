'use client'

import { useState, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, Loader2, LogIn, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'

export function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const unauthorized = params.get('error') === 'unauthorized'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(unauthorized ? 'This account is not authorised to open the admin dashboard.' : '')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setLoading(false)
      setError(
        signInError.message.toLowerCase().includes('invalid')
          ? 'Incorrect email or password.'
          : signInError.message,
      )
      return
    }

    router.replace('/admin')
    router.refresh()
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-white/[0.1] bg-[#0b1220]/90 p-7 shadow-2xl backdrop-blur sm:p-8">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-400/25 bg-brand-400/10 text-brand-300">
          <Lock size={19} />
        </span>
        <h1 className="mt-4 text-xl font-semibold text-white">Owner sign in</h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">
          This area is restricted to the portfolio owner. Sign in with the email registered for
          the admin account.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="field-label">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="field"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="field-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="field"
              placeholder="••••••••"
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-red-500/25 bg-red-500/[0.08] px-3.5 py-2.5 text-[12.5px] text-red-300">
              {error}
            </div>
          ) : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Signing in…
              </>
            ) : (
              <>
                <LogIn size={16} /> Sign in
              </>
            )}
          </Button>
        </form>

        <p className="mt-5 flex items-start gap-2 text-[11.5px] leading-relaxed text-slate-600">
          <Mail size={13} className="mt-0.5 shrink-0" />
          Lost access? Reset the password from the Supabase dashboard for the portfolio project.
        </p>
      </div>

      <p className="mt-6 text-center text-[11.5px] text-slate-600">
        Public visitors never see this page.
      </p>
    </div>
  )
}
