import Link from 'next/link'
import { Mail } from 'lucide-react'
import { GitHubIcon, InstagramIcon, LinkedInIcon } from '@/components/ui/BrandIcons'
import type { Profile } from '@/lib/types'
import { absoluteUrl } from '@/lib/utils'

export function Footer({ profile }: { profile: Profile }) {
  const year = new Date().getFullYear()
  const socials = [
    { label: 'GitHub', href: absoluteUrl(profile.socials?.github), icon: GitHubIcon },
    { label: 'LinkedIn', href: absoluteUrl(profile.socials?.linkedin), icon: LinkedInIcon },
    { label: 'Instagram', href: absoluteUrl(profile.socials?.instagram), icon: InstagramIcon },
  ].filter((item) => item.href)

  return (
    <footer className="relative border-t border-white/[0.07] bg-[#04060c]">
      <div className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-40 w-[60%] rounded-full bg-brand-600/[0.08] blur-3xl" />

      <div className="container-page relative py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <Link href="#top" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-500/40 bg-brand-500/10 font-mono text-[12px] font-semibold text-cyan-300">
                {'</>'}
              </span>
              <span className="text-[15px] font-semibold tracking-[0.06em] text-white">
                ASWIN A V
              </span>
            </Link>
            <p className="mt-3 text-[13.5px] leading-relaxed text-slate-500">
              Aspiring DevOps Engineer and Cloud Computing enthusiast, building a career across
              Linux, automation, CI/CD and cloud infrastructure.
            </p>
            <div className="mt-4 flex gap-2">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-slate-400 transition-colors hover:border-white/[0.2] hover:text-white"
                >
                  <Icon className="h-[15px] w-[15px]" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
                Explore
              </p>
              <ul className="mt-3 space-y-2 text-[13px] text-slate-400">
                <li><a className="hover:text-white" href="#about">About</a></li>
                <li><a className="hover:text-white" href="#education">Education</a></li>
                <li><a className="hover:text-white" href="#experience">Experience</a></li>
                <li><a className="hover:text-white" href="#skills">Skills</a></li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
                More
              </p>
              <ul className="mt-3 space-y-2 text-[13px] text-slate-400">
                <li><a className="hover:text-white" href="#training">DevOps Training</a></li>
                <li><a className="hover:text-white" href="#certifications">Certifications</a></li>
                <li><a className="hover:text-white" href="#interests">Career Interests</a></li>
                <li><a className="hover:text-white" href="#resume">Resume</a></li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
                Contact
              </p>
              <ul className="mt-3 space-y-2 text-[13px] text-slate-400">
                {profile.email ? (
                  <li>
                    <a
                      href={`mailto:${profile.email}`}
                      className="inline-flex items-center gap-1.5 hover:text-white"
                    >
                      <Mail size={13} /> Email me
                    </a>
                  </li>
                ) : null}
                <li>
                  <a href="#contact" className="hover:text-white">Enquiry form</a>
                </li>
                <li>
                  <a href="#top" className="hover:text-white">Back to top</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-[12px] text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} ASWIN A V. All rights reserved.</p>
          <p className="font-mono text-[11px] tracking-wide">
            Built with Next.js · Supabase · Vercel
          </p>
        </div>
      </div>
    </footer>
  )
}
