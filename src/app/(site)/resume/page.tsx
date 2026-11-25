import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Download, Mail, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PrintButton } from '@/components/site/PrintButton'
import { getSiteContent } from '@/lib/content'
import { storageUrl } from '@/lib/storage'
import { absoluteUrl } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Resume',
  description:
    'Resume of ASWIN A V — aspiring DevOps Engineer and Cloud Computing enthusiast. Computer Engineering background, DevOps training, technical skills and contact details.',
}

export const revalidate = 300

export default async function ResumePage() {
  const { profile, education, experience, skills } = await getSiteContent()
  const resumeUrl = storageUrl('documents', profile.resume_path)

  const groups = Array.from(new Set(skills.map((skill) => skill.category))).map((category) => ({
    category,
    items: skills.filter((skill) => skill.category === category),
  }))

  return (
    <div className="relative min-h-screen bg-[#04060c] pb-20 pt-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.12),transparent_70%)]" />

      <div className="container-page relative">
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[13px] text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={15} /> Back to portfolio
          </Link>
          <div className="flex gap-2">
            <PrintButton />
            {resumeUrl ? (
              <Button href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <Download size={16} /> Download PDF
              </Button>
            ) : null}
          </div>
        </div>

        <article className="print-sheet mx-auto max-w-3xl rounded-2xl border border-white/[0.1] bg-[#080d18] p-8 shadow-card sm:p-12">
          {/* header */}
          <header className="border-b border-white/[0.1] pb-7">
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {profile.full_name}
            </h1>
            <p className="mt-2 text-[15px] font-medium text-cyan-300">{profile.headline}</p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] text-slate-400">
              {profile.location ? (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={12} /> {profile.location}
                </span>
              ) : null}
              {profile.email ? (
                <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-1.5">
                  <Mail size={12} /> {profile.email}
                </a>
              ) : null}
              {profile.phone ? (
                <span className="inline-flex items-center gap-1.5">
                  <Phone size={12} /> {profile.phone}
                </span>
              ) : null}
              {profile.socials?.github ? (
                <a
                  href={absoluteUrl(profile.socials.github)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5"
                >
                  github.com/{profile.socials.github.split('/').filter(Boolean).pop()}
                </a>
              ) : null}
              {profile.socials?.linkedin ? (
                <a
                  href={absoluteUrl(profile.socials.linkedin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5"
                >
                  LinkedIn
                </a>
              ) : null}
            </div>
          </header>

          {/* summary */}
          <section className="mt-7">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300">
              Professional summary
            </h2>
            <div className="mt-3 space-y-3 text-[13px] leading-relaxed text-slate-300">
              {(profile.about || '')
                .split(/\n{2,}/)
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>
          </section>

          {/* education */}
          <section className="mt-8">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300">
              Education
            </h2>
            <div className="mt-3 space-y-4">
              {education.map((item) => (
                <div key={item.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="text-[14px] font-semibold text-white">{item.degree}</h3>
                    <span className="text-[11.5px] text-slate-500">{item.duration}</span>
                  </div>
                  <p className="text-[12.5px] text-slate-300">
                    {item.institution}
                    {item.location ? ` · ${item.location}` : ''}
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-emerald-300/90">{item.status}</p>
                  {item.description ? (
                    <p className="mt-1 text-[12px] leading-relaxed text-slate-400">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          {/* experience */}
          <section className="mt-8">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300">
              Experience & training
            </h2>
            <div className="mt-3 space-y-4">
              {experience.map((item) => (
                <div key={item.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="text-[14px] font-semibold text-white">{item.role}</h3>
                    <span className="text-[11.5px] text-slate-500">{item.duration}</span>
                  </div>
                  <p className="text-[12.5px] text-slate-300">
                    {item.organization}
                    {item.location ? ` · ${item.location}` : ''} ·{' '}
                    {item.type === 'internship' ? 'Internship' : 'Training programme'}
                  </p>
                  {item.description ? (
                    <p className="mt-1.5 text-[12px] leading-relaxed text-slate-400">
                      {item.description}
                    </p>
                  ) : null}
                  {item.technologies.length > 0 ? (
                    <p className="mt-1 text-[11.5px] text-slate-500">
                      Tools: {item.technologies.join(', ')}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          {/* skills */}
          <section className="mt-8">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300">
              Technical skills
            </h2>
            <dl className="mt-3 space-y-2.5">
              {groups.map((group) => (
                <div key={group.category} className="grid grid-cols-[150px_1fr] gap-3">
                  <dt className="text-[12px] font-medium text-slate-300">{group.category}</dt>
                  <dd className="text-[12px] leading-relaxed text-slate-400">
                    {group.items.map((skill) => skill.name).join(' · ')}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-[11px] italic text-slate-600">
              Proficiency labels on the portfolio reflect study and practice, not professional
              production experience.
            </p>
          </section>

          {/* interests */}
          <section className="mt-8">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300">
              Career interests
            </h2>
            <p className="mt-3 text-[12.5px] leading-relaxed text-slate-400">
              DevOps Engineering · Cloud Computing · Linux System Administration · CI/CD Automation
              · Containerization · Infrastructure as Code · Cloud Infrastructure · Monitoring and
              Observability · Automation and Deployment
            </p>
          </section>

          <footer className="mt-10 border-t border-white/[0.1] pt-4 text-[11px] text-slate-600">
            References and certificates available on request. No academic marks, awards or
            unverified achievements are claimed.
          </footer>
        </article>

        <p className="no-print mt-6 text-center text-[11.5px] text-slate-600">
          This layout is print-friendly. Use “Print / Save as PDF” for an ATS-readable copy.
        </p>
      </div>
    </div>
  )
}
