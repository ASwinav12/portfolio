import { ArrowRight, Download, Mail, MapPin, Terminal, Cloud, Container, Boxes } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { GitHubIcon, InstagramIcon, LinkedInIcon } from '@/components/ui/BrandIcons'
import { storageUrl } from '@/lib/storage'
import { absoluteUrl, cn } from '@/lib/utils'
import type { Profile } from '@/lib/types'

export function ProfilePhoto({
  profile,
  className,
}: {
  profile: Profile
  className?: string
}) {
  const photo = storageUrl('images', profile.photo_path)

  if (photo) {
    return (
      <img
        src={photo}
        alt={`Portrait of ${profile.full_name}`}
        className={cn('h-full w-full object-cover', className)}
        loading="eager"
        decoding="async"
      />
    )
  }

  return (
    <div
      className={cn(
        'relative flex h-full w-full flex-col items-center justify-center overflow-hidden',
        className,
      )}
      role="img"
      aria-label="Profile photo placeholder"
    >
      <div className="bg-dot absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(59,130,246,0.22),transparent_60%)]" />
      <div className="relative flex flex-col items-center">
        <span className="text-gradient text-[76px] font-semibold leading-none tracking-tight sm:text-[92px]">
          AV
        </span>
        <span className="mt-5 h-px w-16 bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
        <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
          Profile photo
        </span>
      </div>
    </div>
  )
}

export function Hero({ profile, resumeHref }: { profile: Profile; resumeHref: string }) {
  const [first, ...rest] = profile.headline.split('|').map((part) => part.trim())
  const github = absoluteUrl(profile.socials?.github)
  const linkedin = absoluteUrl(profile.socials?.linkedin)
  const instagram = absoluteUrl(profile.socials?.instagram)

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-16 pt-28 sm:pt-32"
    >
      {/* background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0" />
        <div className="absolute -left-40 top-[-10%] h-[520px] w-[520px] rounded-full bg-brand-600/[0.13] blur-[120px]" />
        <div className="absolute -right-32 top-[15%] h-[460px] w-[460px] rounded-full bg-cyan-400/[0.09] blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[35%] h-[420px] w-[420px] rounded-full bg-violet-600/[0.10] blur-[130px]" />
      </div>

      <div className="container-page relative grid items-center gap-14 lg:grid-cols-[1.12fr_0.88fr] lg:gap-10">
        {/* --- copy --- */}
        <div className="max-w-2xl">
          <div className="reveal is-visible inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] py-1.5 pl-2 pr-3.5 text-[12px] font-medium text-slate-300 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {profile.availability || 'Open to entry-level DevOps and Cloud opportunities'}
          </div>

          <h1 className="mt-6 text-[44px] font-semibold leading-[1.02] tracking-[-0.03em] text-white sm:text-6xl lg:text-[72px]">
            {profile.full_name}
          </h1>

          <p className="mt-5 text-[22px] font-medium leading-snug tracking-tight sm:text-[27px]">
            <span className="text-gradient">{first}</span>
            {rest.length > 0 ? (
              <>
                <span className="block text-slate-400">{rest.join(' · ')}</span>
              </>
            ) : null}
          </p>

          <p className="mt-6 max-w-xl text-[15px] leading-[1.75] text-slate-400">
            Computer Engineering graduate focused on DevOps and cloud infrastructure. I enjoy
            automating repetitive work, building CI/CD pipelines, containerising applications and
            understanding how modern infrastructure is provisioned and monitored.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href="#projects" size="lg">
              View My Work
              <ArrowRight size={17} />
            </Button>
            <Button href={resumeHref} variant="secondary" size="lg">
              <Download size={17} />
              Download Resume
            </Button>
            <Button href="#contact" variant="ghost" size="lg">
              Contact Me
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-3">
            {[
              { href: github, label: 'GitHub', icon: GitHubIcon },
              { href: linkedin, label: 'LinkedIn', icon: LinkedInIcon },
              { href: instagram, label: 'Instagram', icon: InstagramIcon },
            ].map(({ href, label, icon: Icon }) =>
              href ? (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.03] text-slate-400 transition-all hover:-translate-y-0.5 hover:border-cyan-300/40 hover:text-cyan-300"
                >
                  <Icon className="h-[17px] w-[17px]" />
                </a>
              ) : null,
            )}
            <span className="ml-1 hidden h-6 w-px bg-white/[0.08] sm:block" />
            <span className="hidden items-center gap-1.5 text-[12.5px] text-slate-500 sm:flex">
              <MapPin size={13} /> {profile.location || 'Kerala, India'}
            </span>
          </div>
        </div>

        {/* --- portrait --- */}
        <div className="reveal is-visible relative mx-auto w-full max-w-[380px] sm:max-w-[420px]">
          <div className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-brand-500/25 via-cyan-400/10 to-violet-500/20 blur-3xl" />

          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/[0.14] bg-[#080d18] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)]">
              <ProfilePhoto profile={profile} />

              {/* inner vignette */}
              <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-[linear-gradient(to_top,rgba(4,6,12,0.85),transparent_45%)]" />
              <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-white/[0.06]" />

              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-300/90">
                      DevOps · Cloud · Automation
                    </p>
                    <p className="mt-1 text-[13px] text-slate-300">
                      {profile.location || 'Kerala, India'}
                    </p>
                  </div>
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.06] text-slate-200 backdrop-blur transition-colors hover:border-cyan-300/40 hover:text-cyan-300"
                    aria-label="Email ASWIN A V"
                  >
                    <Mail size={16} />
                  </a>
                </div>
              </div>
            </div>

            {/* floating tech chips */}
            <div className="absolute -left-6 top-10 hidden animate-float-slow sm:block">
              <span className="chip border-white/[0.12] bg-[#0a1020]/90 shadow-lg backdrop-blur">
                <Terminal size={13} className="text-cyan-300" /> Linux
              </span>
            </div>
            <div
              className="absolute -right-7 top-28 hidden animate-float-slow sm:block"
              style={{ animationDelay: '-3s' }}
            >
              <span className="chip border-white/[0.12] bg-[#0a1020]/90 shadow-lg backdrop-blur">
                <Container size={13} className="text-brand-300" /> Docker
              </span>
            </div>
            <div
              className="absolute -left-8 bottom-24 hidden animate-float-slow sm:block"
              style={{ animationDelay: '-6s' }}
            >
              <span className="chip border-white/[0.12] bg-[#0a1020]/90 shadow-lg backdrop-blur">
                <Cloud size={13} className="text-violet-300" /> AWS
              </span>
            </div>
            <div
              className="absolute -right-5 bottom-10 hidden animate-float-slow sm:block"
              style={{ animationDelay: '-9s' }}
            >
              <span className="chip border-white/[0.12] bg-[#0a1020]/90 shadow-lg backdrop-blur">
                <Boxes size={13} className="text-emerald-300" /> Kubernetes
              </span>
            </div>
          </div>

          <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-slate-600">
            Computer Engineering · DevOps Training
          </p>
        </div>
      </div>

      {/* scroll hint */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block">
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/[0.12] p-1">
          <span className="h-2 w-1 animate-bounce rounded-full bg-cyan-300/70" />
        </div>
      </div>
    </section>
  )
}
