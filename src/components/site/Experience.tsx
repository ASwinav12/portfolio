import { Briefcase, Calendar, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/lib/utils'
import type { Experience as ExperienceType } from '@/lib/types'

export function ExperienceSection({ items }: { items: ExperienceType[] }) {
  return (
    <section id="experience" className="section relative">
      <div className="container-page">
        <SectionHeading
          eyebrow="Experience"
          title={
            <>
              Practical exposure, <span className="text-gradient-soft">honestly described</span>
            </>
          }
          description="Introductory internship experience and structured training — the foundation I am building a DevOps career on."
        />

        <div className="relative mt-14 max-w-4xl">
          <div className="absolute bottom-2 left-[19px] top-2 hidden w-px bg-gradient-to-b from-brand-500/40 via-white/[0.08] to-transparent sm:block" />

          <div className="space-y-8">
            {items.map((item, index) => (
              <Reveal key={item.id} delay={index * 110}>
                <div className="relative flex gap-5 sm:gap-7">
                  <div
                    className={cn(
                      'relative z-10 mt-1 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.12] bg-[#080d18] sm:flex',
                      item.type === 'internship' ? 'text-cyan-300' : 'text-violet-300',
                    )}
                  >
                    <Briefcase size={15} strokeWidth={1.8} />
                    <span
                      className={cn(
                        'absolute inset-0 rounded-full blur-md',
                        item.type === 'internship' ? 'bg-cyan-400/20' : 'bg-violet-400/20',
                      )}
                    />
                  </div>

                  <Card className="flex-1 p-6 sm:p-7">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        tone={item.type === 'internship' ? 'Practical Exposure' : 'Currently Learning'}
                      >
                        {item.type === 'internship' ? 'Internship' : 'Training programme'}
                      </Badge>
                      {item.duration ? (
                        <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-500">
                          <Calendar size={12} /> {item.duration}
                        </span>
                      ) : null}
                    </div>

                    <h3 className="mt-4 text-[19px] font-semibold text-white">{item.role}</h3>
                    <p className="mt-1 text-[13.5px] text-cyan-300/90">{item.organization}</p>

                    {item.location ? (
                      <p className="mt-1 inline-flex items-center gap-1.5 text-[12.5px] text-slate-500">
                        <MapPin size={12} /> {item.location}
                      </p>
                    ) : null}

                    <p className="mt-4 text-[14px] leading-relaxed text-slate-300/90">
                      {item.description}
                    </p>

                    {item.technologies.length > 0 ? (
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {item.technologies.map((tech) => (
                          <span key={tech} className="chip text-[11px]">
                            {tech}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </Card>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
