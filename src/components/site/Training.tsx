import {
  Activity,
  Boxes,
  Cloud,
  Container,
  GitBranch,
  Layers,
  Settings2,
  ShieldCheck,
  Sparkles,
  Terminal,
  Workflow,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { TrainingModule } from '@/lib/types'

const ICONS = [
  Terminal,
  Cloud,
  GitBranch,
  Workflow,
  Container,
  Boxes,
  Layers,
  Settings2,
  Activity,
  ShieldCheck,
  Sparkles,
]

export function TrainingSection({ modules }: { modules: TrainingModule[] }) {
  return (
    <section id="training" className="section relative overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-1/4 h-[420px] w-[420px] rounded-full bg-violet-600/[0.07] blur-[120px]" />
      <div className="container-page relative">
        <SectionHeading
          eyebrow="DevOps & Cloud Training"
          title="What I have been learning"
          description="A structured six-month programme at Zoople Technologies, covering the tools and practices used to build, ship and operate modern software."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {modules.map((module, index) => {
            const Icon = ICONS[index % ICONS.length]
            return (
              <Reveal key={module.id} delay={(index % 4) * 60}>
                <Card className="h-full p-5">
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-300">
                      <Icon size={17} strokeWidth={1.7} />
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.18em] text-slate-600">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="mt-4 text-[14.5px] font-medium text-white">{module.title}</h3>
                  {module.description ? (
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-400">
                      {module.description}
                    </p>
                  ) : null}

                  {module.topics.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {module.topics.slice(0, 4).map((topic) => (
                        <span
                          key={topic}
                          className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[10.5px] text-slate-500"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </Card>
              </Reveal>
            )
          })}
        </div>

        <p className="mt-8 text-center text-[12px] leading-relaxed text-slate-600">
          Training and learning areas — not claims of professional production experience.
        </p>
      </div>
    </section>
  )
}
