'use client'

import { useState, type FormEvent } from 'react'
import { CheckCircle2, Loader2, Mail, Phone, Send, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { GitHubIcon, InstagramIcon, LinkedInIcon } from '@/components/ui/BrandIcons'
import { ENQUIRY_TYPES } from '@/lib/validation'
import { absoluteUrl, cn } from '@/lib/utils'
import type { Profile } from '@/lib/types'

type Phase = 'idle' | 'submitting' | 'success' | 'error'

export function ContactSection({ profile }: { profile: Profile }) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [notice, setNotice] = useState('')
  const [emailStatus, setEmailStatus] = useState<'sent' | 'not_configured' | 'error'>('sent')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const socials = [
    { label: 'GitHub', href: absoluteUrl(profile.socials?.github), icon: GitHubIcon },
    { label: 'LinkedIn', href: absoluteUrl(profile.socials?.linkedin), icon: LinkedInIcon },
    { label: 'Instagram', href: absoluteUrl(profile.socials?.instagram), icon: InstagramIcon },
  ].filter((item) => item.href)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (phase === 'submitting') return

    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      company: String(formData.get('company') ?? ''),
      enquiryType: String(formData.get('enquiryType') ?? ''),
      subject: String(formData.get('subject') ?? ''),
      message: String(formData.get('message') ?? ''),
      website: String(formData.get('website') ?? ''),
    }

    setPhase('submitting')
    setNotice('')
    setFieldErrors({})

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean
        emailed?: boolean
        emailStatus?: 'sent' | 'not_configured' | 'error'
        error?: string
        fields?: Record<string, string>
      }

      if (!response.ok || !data.ok) {
        setFieldErrors(data.fields ?? {})
        setNotice(data.error || 'Something went wrong. Please try again in a moment.')
        setPhase('error')
        return
      }

      setEmailStatus(data.emailStatus ?? (data.emailed ? 'sent' : 'not_configured'))
      form.reset()
      setPhase('success')
    } catch {
      setNotice('Network error. Please check your connection and try again.')
      setPhase('error')
    }
  }

  return (
    <section id="contact" className="section relative overflow-hidden">
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[460px] w-[460px] rounded-full bg-brand-600/[0.10] blur-[130px]" />
      <div className="pointer-events-none absolute -right-32 top-10 h-[360px] w-[360px] rounded-full bg-cyan-400/[0.07] blur-[120px]" />

      <div className="container-page relative">
        <SectionHeading
          eyebrow="Contact"
          title="Let's talk about DevOps, cloud or your next role"
          description="Hiring for an entry-level DevOps or Cloud position? Want to collaborate on something? Send a message — it lands directly in my inbox."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <Card className="p-6 sm:p-8" hover={false}>
              {phase === 'success' ? (
                <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
                    <CheckCircle2 size={26} />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-white">Message received</h3>
                  <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-slate-400">
                    {emailStatus === 'sent'
                      ? `Your enquiry has been delivered to ${profile.email || 'aswinav277@gmail.com'}. I will get back to you as soon as I can.`
                      : emailStatus === 'error'
                        ? `Your enquiry was saved, but email delivery failed on the server. Please also email me directly at ${profile.email || 'aswinav277@gmail.com'}.`
                        : `Your enquiry has been saved securely. Email delivery is not configured yet, so please also email me directly at ${profile.email || 'aswinav277@gmail.com'}.`}
                  </p>
                  <Button
                    className="mt-6"
                    variant="secondary"
                    onClick={() => {
                      setPhase('idle')
                      setNotice('')
                    }}
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="field-label">
                        Full name <span className="text-cyan-300">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        placeholder="Your name"
                        className="field"
                        aria-invalid={Boolean(fieldErrors.name)}
                      />
                      {fieldErrors.name ? (
                        <p className="mt-1.5 text-[11.5px] text-red-400">{fieldErrors.name}</p>
                      ) : null}
                    </div>

                    <div>
                      <label htmlFor="email" className="field-label">
                        Email address <span className="text-cyan-300">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="you@company.com"
                        className="field"
                        aria-invalid={Boolean(fieldErrors.email)}
                      />
                      {fieldErrors.email ? (
                        <p className="mt-1.5 text-[11.5px] text-red-400">{fieldErrors.email}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="company" className="field-label">
                        Company name <span className="text-slate-600">(optional)</span>
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        autoComplete="organization"
                        placeholder="Company or team"
                        className="field"
                      />
                    </div>

                    <div>
                      <label htmlFor="enquiryType" className="field-label">
                        Enquiry type
                      </label>
                      <select id="enquiryType" name="enquiryType" className="field">
                        {ENQUIRY_TYPES.map((type) => (
                          <option key={type} value={type} className="bg-[#0b1220]">
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="field-label">
                      Subject <span className="text-cyan-300">*</span>
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      placeholder="What is this about?"
                      className="field"
                      aria-invalid={Boolean(fieldErrors.subject)}
                    />
                    {fieldErrors.subject ? (
                      <p className="mt-1.5 text-[11.5px] text-red-400">{fieldErrors.subject}</p>
                    ) : null}
                  </div>

                  <div>
                    <label htmlFor="message" className="field-label">
                      Message <span className="text-cyan-300">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="A little context helps me reply faster…"
                      className="field resize-none"
                      aria-invalid={Boolean(fieldErrors.message)}
                    />
                    {fieldErrors.message ? (
                      <p className="mt-1.5 text-[11.5px] text-red-400">{fieldErrors.message}</p>
                    ) : null}
                  </div>

                  {/* Honeypot — hidden from humans, filled by bots */}
                  <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
                    <label htmlFor="website">Website</label>
                    <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                  </div>

                  {phase === 'error' && notice ? (
                    <div className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/[0.07] px-3.5 py-3 text-[12.5px] text-red-300">
                      <AlertCircle size={15} className="mt-0.5 shrink-0" />
                      {notice}
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[11.5px] text-slate-600">
                      Required fields are marked with *. Your details are never published.
                    </p>
                    <Button type="submit" disabled={phase === 'submitting'} className="sm:min-w-[170px]">
                      {phase === 'submitting' ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Sending…
                        </>
                      ) : (
                        <>
                          <Send size={15} /> Send message
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </Reveal>

          <Reveal delay={120}>
            <div className="space-y-4">
              <Card className="p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  Direct contact
                </p>
                <div className="mt-4 space-y-3">
                  <a
                    href={`mailto:${profile.email}`}
                    className="group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5 transition-colors hover:border-cyan-300/30 hover:bg-white/[0.05]"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300">
                      <Mail size={16} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] uppercase tracking-[0.14em] text-slate-500">
                        Email me
                      </span>
                      <span className="block truncate text-[13px] text-slate-200">
                        {profile.email}
                      </span>
                    </span>
                  </a>

                  <a
                    href={`tel:${(profile.phone || '').replace(/\s+/g, '')}`}
                    className="group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5 transition-colors hover:border-cyan-300/30 hover:bg-white/[0.05]"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-400/10 text-brand-300">
                      <Phone size={16} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] uppercase tracking-[0.14em] text-slate-500">
                        Call me
                      </span>
                      <span className="block text-[13px] text-slate-200">{profile.phone}</span>
                    </span>
                  </a>
                </div>
              </Card>

              <Card className="p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  Elsewhere
                </p>
                <div className="mt-4 flex gap-2">
                  {socials.map(({ label, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-[12px] font-medium text-slate-300 transition-colors hover:border-white/[0.2] hover:text-white',
                      )}
                      aria-label={label}
                    >
                      <Icon className="h-[14px] w-[14px]" />
                      <span className="hidden sm:inline">{label}</span>
                    </a>
                  ))}
                </div>
              </Card>

              <Card className="p-5">
                <p className="text-[12.5px] leading-relaxed text-slate-500">
                  I usually reply within a day or two. For faster response, email is best.
                </p>
              </Card>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
