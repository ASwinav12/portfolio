import { StatusDot } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { PROFICIENCY_ORDER } from '@/lib/content'
import { cn } from '@/lib/utils'
import type { Skill } from '@/lib/types'

const CATEGORY_ORDER = [
  'DevOps & Cloud',
  'Programming Languages',
  'Web Development',
  'Frontend Framework',
  'Computer Engineering',
  'Database & Applications',
]

const CATEGORY_ICON: Record<string, string> = {
  'DevOps & Cloud': '☁',
  'Programming Languages': '{ }',
  'Web Development': '</>',
  'Frontend Framework': '⚛',
  'Computer Engineering': '▣',
  'Database & Applications': '☰',
}

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    items: skills.filter((skill) => skill.category === category),
  })).filter((group) => group.items.length > 0)

  const extraCategories = Array.from(
    new Set(skills.map((skill) => skill.category).filter((c) => !CATEGORY_ORDER.includes(c))),
  ).map((category) => ({
    category,
    items: skills.filter((skill) => skill.category === category),
  }))

  const allGroups = [...groups, ...extraCategories]

  return (
    <section id="skills" className="section relative">
      <div className="container-page">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Technical Skills"
            title="Tools, concepts and honest proficiency"
            description="Every label here reflects real study or practice — no invented percentages, no claims of mastery."
          />
          <div className="flex flex-wrap gap-x-4 gap-y-2 lg:pb-1">
            {PROFICIENCY_ORDER.map((level) => (
              <span key={level} className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                <StatusDot level={level} /> {level}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {allGroups.map((group, groupIndex) => (
            <Reveal
              key={group.category}
              delay={(groupIndex % 3) * 80}
              className={cn(
                'h-full',
                group.category === 'DevOps & Cloud' && 'sm:col-span-2 lg:col-span-2',
              )}
            >
              <Card className="flex h-full flex-col p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.04] font-mono text-[13px] text-cyan-300">
                      {CATEGORY_ICON[group.category] ?? '•'}
                    </span>
                    <h3 className="text-[14.5px] font-medium text-white">{group.category}</h3>
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.18em] text-slate-600">
                    {String(group.items.length).padStart(2, '0')}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span
                      key={skill.id}
                      title={skill.level}
                      className="group inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5 text-[12.5px] text-slate-300 transition-colors hover:border-white/[0.16] hover:bg-white/[0.05]"
                    >
                      <StatusDot level={skill.level} />
                      {skill.name}
                      <span className="hidden text-[10px] text-slate-600 group-hover:inline">
                        {skill.level}
                      </span>
                    </span>
                  ))}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
