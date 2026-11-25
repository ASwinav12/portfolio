'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ShieldCheck, UserPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export function SetupForm({ ownerEmail }: { ownerEmail: string }) {
  const router = useRouter()
  const [email, setEmail] = useState(ownerEmail)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (email.trim().toLowerCase() !== ownerEmail.toLowerCase()) {
      setError(`This form only creates the owner account for ${ownerEmail}.`)
      return
    }
    if (password.length < 10) {
      setError('Use at least 10 characters for the password.')
      return
    }
    if (password !== confirm) {
      setError('The two passwords do not match.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: signUpError } = await supabase.auth.signUp({ email, password })

    if (signUpError) {
      setLoading(false)
      setError(signUpError.message)
      return
    }

    setLoading(false)
    setDone(true)
    router.replace('/admin')
    router.refresh()
  }

  const strength = (() => {
    let score = 0
    if (password.length >= 10) score++
    if (password.length >= 14) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  })()

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-white/[0.1] bg-[#0b1220]/90 p-7 shadow-2xl backdrop-blur sm:p-8">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
          <UserPlus size={19} />
        </span>
        <h1 className="mt-4 text-xl font-semibold text-white">Create the owner account</h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">
          One-time setup. Only <span className="text-slate-200">{ownerEmail}</span> can become the
          admin — every other email is rejected by the database.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="setup-email" className="field-label">
              Email address
            </label>
            <input
              id="setup-email"
              type="email"
              readOnly
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="field cursor-not-allowed opacity-80"
            />
          </div>

          <div>
            <label htmlFor="setup-password" className="field-label">
              Password
            </label>
            <input
              id="setup-password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="field"
              placeholder="At least 10 characters"
            />
            <div className="mt-2 flex gap-1">
              {[0, 1, 2, 3, 4].map((index) => (
                <span
                  key={index}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors',
                    index < strength
                      ? strength >= 4
                        ? 'bg-emerald-400'
                        : strength >= 2
                          ? 'bg-amber-400'
                          : 'bg-red-400'
                      : 'bg-white/[0.08]',
                  )}
                />
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="setup-confirm" className="field-label">
              Confirm password
            </label>
            <input
              id="setup-confirm"
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              className="field"
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-red-500/25 bg-red-500/[0.08] px-3.5 py-2.5 text-[12.5px] text-red-300">
              {error}
            </div>
          ) : null}

          <Button type="submit" className="w-full" disabled={loading || done}>
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Creating account…
              </>
            ) : done ? (
              <>
                <ShieldCheck size={16} /> Account created
              </>
            ) : (
              <>
                <UserPlus size={16} /> Create admin account
              </>
            )}
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-[11.5px] text-slate-600">
        After signing in, public sign-up is disabled — this page will stop accepting new accounts.
      </p>
    </div>
  )
}
