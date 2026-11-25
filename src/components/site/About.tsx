import { Cloud, Cpu, Mail, MapPin, Terminal, Wrench } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { splitParagraphs } from '@/lib/utils'
import type { Profile } from '@/lib/types'

export function About({ profile }: { profile: Profile }) {
  const paragraphs = splitParagraphs(profile.about)

  const facts = [
    { icon: MapPin, label: 'Based in', value: profile.location || 'Kerala, India' },
    { icon: Mail, label: 'Email', value: profile.email || 'aswinav277@gmail.com' },
    { icon: Terminal, label: 'Focus', value: 'DevOps & Cloud' },
    { icon: Cpu, label: 'Background', value: 'Computer Engineering' },
  ]

  return (
    <section id="about" className="section">
      <div className="container-page">
        <SectionHeading
          eyebrow="About"
          title={
            <>
              Building a career where <span className="text-gradient">code meets infrastructure</span>
            </>
          }
          description="A Computer Engineering foundation, practical DevOps training and a genuine interest in how software is shipped, secured and kept running."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <Reveal>
            <div className="space-y-5 text-[15.5px] leading-[1.8] text-slate-300/90">
              {paragraphs.length > 0 ? (
                paragraphs.map((paragraph, index) => (
                  <p key={index} className={index === 0 ? 'text-slate-200' : undefined}>
                    {paragraph}
                  </p>
                ))
              ) : (
                <p>
                  I am a Computer Engineering graduate from Kerala with a growing focus on DevOps
                  and cloud infrastructure.
                </p>
              )}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: Cpu,
                  title: 'Computer Engineering',
                  text: 'Three-year diploma covering computer systems, architecture, hardware and programming.',
                },
                {
                  icon: Terminal,
                  title: 'Six-month DevOps programme',
                  text: 'Zoople Technologies — Linux, CI/CD, containers, IaC and observability.',
                },
                {
                  icon: Cloud,
                  title: 'Cloud & automation',
                  text: 'Learning AWS, Terraform and Ansible alongside pipeline and monitoring tooling.',
                },
              ].map((item) => (
                <Card key={item.title} className="p-5">
                  <item.icon size={19} className="text-cyan-300" strokeWidth={1.7} />
                  <h3 className="mt-3 text-[13.5px] font-medium text-white">{item.title}</h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-400">{item.text}</p>
                </Card>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <Card className="p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Quick facts
              </p>
              <ul className="mt-4 space-y-3.5">
                {facts.map(({ icon: Icon, label, value }) => (
                  <li key={label} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-slate-400">
                      <Icon size={14} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">{label}</p>
                      <p className="mt-0.5 break-words text-[13.5px] text-slate-200">{value}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="flex items-center gap-2">
                  <Wrench size={14} className="text-brand-300" />
                  <p className="text-[12px] font-medium text-slate-200">Currently exploring</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {['AWS', 'Kubernetes', 'Terraform', 'Prometheus'].map((item) => (
                    <span key={item} className="chip text-[11px]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
