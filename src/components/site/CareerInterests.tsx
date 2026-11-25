import {
  Activity,
  Boxes,
  Cloud,
  Code2,
  GitBranch,
  Infinity,
  Server,
  TerminalSquare,
  Workflow,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

const INTERESTS = [
  {
    icon: Infinity,
    title: 'DevOps Engineering',
    text: 'Building the practices that connect development and operations.',
  },
  {
    icon: Cloud,
    title: 'Cloud Computing',
    text: 'Designing and deploying workloads on cloud infrastructure.',
  },
  {
    icon: TerminalSquare,
    title: 'Linux System Administration',
    text: 'Managing servers, permissions, processes and services.',
  },
  {
    icon: Workflow,
    title: 'CI/CD Automation',
    text: 'Automating build, test and deployment pipelines.',
  },
  {
    icon: Boxes,
    title: 'Containerization',
    text: 'Packaging applications so they run the same everywhere.',
  },
  {
    icon: Code2,
    title: 'Infrastructure as Code',
    text: 'Provisioning infrastructure with Terraform and versioned config.',
  },
  {
    icon: Server,
    title: 'Cloud Infrastructure',
    text: 'Networking, compute and storage that scale reliably.',
  },
  {
    icon: Activity,
    title: 'Monitoring & Observability',
    text: 'Metrics, logs and alerts that explain what a system is doing.',
  },
  {
    icon: GitBranch,
    title: 'Automation & Deployment',
    text: 'Removing manual steps from the path to production.',
  },
]

export function CareerInterestsSection() {
  return (
    <section id="interests" className="section relative">
      <div className="pointer-events-none absolute left-0 top-1/3 h-[380px] w-[380px] rounded-full bg-cyan-400/[0.06] blur-[120px]" />
      <div className="container-page relative">
        <SectionHeading
          eyebrow="Career Interests"
          title="Where I want to grow"
          description="I am focused on entry-level DevOps and Cloud opportunities — roles where I can contribute, learn from experienced engineers and build depth over time."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INTERESTS.map((interest, index) => (
            <Reveal key={interest.title} delay={(index % 3) * 60}>
              <Card className="flex h-full gap-4 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.03] text-cyan-300">
                  <interest.icon size={18} strokeWidth={1.7} />
                </span>
                <div>
                  <h3 className="text-[14px] font-medium text-white">{interest.title}</h3>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-slate-400">{interest.text}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
