import { Download, Eye, FileText, ListChecks } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function ResumeSection({
  resumeHref,
  hasResume,
}: {
  resumeHref: string
  hasResume: boolean
}) {
  return (
    <section id="resume" className="section relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      <div className="container-page">
        <SectionHeading
          eyebrow="Resume"
          title="One page, recruiter-ready"
          description="A clean, ATS-friendly summary of my education, training, skills and interests — available as a PDF and as a web view."
        />

        <Reveal className="mt-12">
          <Card className="relative overflow-hidden p-7 sm:p-9" hover={false}>
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand-400/25 bg-brand-400/10 text-brand-300">
                  <FileText size={22} strokeWidth={1.7} />
                </span>
                <h3 className="mt-4 text-xl font-semibold text-white">ASWIN A V — Resume</h3>
                <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-slate-400">
                  {hasResume
                    ? 'The latest uploaded PDF is always the one linked below — replacing it in the Admin Dashboard updates every download button on the site.'
                    : 'A PDF will be available here once uploaded. Until then, you can read the full resume layout in the browser.'}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href={resumeHref} target={hasResume ? '_blank' : undefined} rel={hasResume ? 'noopener noreferrer' : undefined}>
                    <Download size={16} />
                    {hasResume ? 'Download PDF' : 'View resume'}
                  </Button>
                  <Button href="/resume" variant="secondary">
                    <Eye size={16} /> Web version
                  </Button>
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  What is inside
                </p>
                <ul className="mt-4 space-y-3">
                  {[
                    'Profile and career focus',
                    'Education — Computer Engineering, DCA, B.Com',
                    'Internship and six-month DevOps programme',
                    'Technical skills with honest proficiency labels',
                    'Career interests and contact details',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[13px] text-slate-300">
                      <ListChecks size={14} className="mt-0.5 shrink-0 text-cyan-300" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  )
}
