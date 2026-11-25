import { BookOpen, Calendar, CheckCircle2, GraduationCap, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Education as EducationType } from '@/lib/types'

export function EducationSection({ items }: { items: EducationType[] }) {
  return (
    <section id="education" className="section relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      <div className="container-page">
        <SectionHeading
          eyebrow="Education"
          title="Academic foundation"
          description="A computer engineering background that supports the way I think about systems, hardware and software — alongside an ongoing commerce degree."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item.id} delay={index * 90}>
              <Card className="flex h-full flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-400/20 bg-brand-400/10 text-brand-300">
                    <GraduationCap size={20} strokeWidth={1.7} />
                  </span>
                  <Badge tone={item.status === 'Completed' ? 'Practical Exposure' : 'Currently Learning'}>
                    {item.status === 'Completed' ? (
                      <CheckCircle2 size={11} />
                    ) : (
                      <BookOpen size={11} />
                    )}
                    {item.status}
                  </Badge>
                </div>

                <h3 className="mt-5 text-[17px] font-semibold leading-snug text-white">
                  {item.degree}
                </h3>
                <p className="mt-1.5 text-[13.5px] font-medium text-cyan-300/90">
                  {item.institution}
                </p>

                <div className="mt-4 flex flex-col gap-1.5 text-[12.5px] text-slate-500">
                  {item.location ? (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={12} /> {item.location}
                    </span>
                  ) : null}
                  {item.duration ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={12} /> {item.duration}
                    </span>
                  ) : null}
                </div>

                {item.description ? (
                  <p className="mt-4 border-t border-white/[0.06] pt-4 text-[13px] leading-relaxed text-slate-400">
                    {item.description}
                  </p>
                ) : null}
              </Card>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center text-[12px] text-slate-600">
          Diploma curriculum: Kerala Polytechnic Revision 2021.
        </p>
      </div>
    </section>
  )
}
