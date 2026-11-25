import { ArrowUpRight, FolderGit2 } from 'lucide-react'
import { GitHubIcon } from '@/components/ui/BrandIcons'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card } from '@/components/ui/Card'
import { storageUrl } from '@/lib/storage'
import { absoluteUrl, cn } from '@/lib/utils'
import type { Profile, Project } from '@/lib/types'

export function ProjectsSection({
  projects,
  profile,
}: {
  projects: Project[]
  profile: Profile
}) {
  const github = absoluteUrl(profile.socials?.github)

  return (
    <section id="projects" className="section relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      <div className="container-page">
        <SectionHeading
          eyebrow="Projects"
          title="Work in progress"
          description="I am building and documenting DevOps projects as I learn. Real repositories, real pipelines, real infrastructure — published once they are ready."
        />

        {projects.length === 0 ? (
          <Reveal className="mt-12">
            <EmptyState
              icon={FolderGit2}
              title="Projects are on the way"
              description="Nothing is listed here yet because I would rather show real, working projects than polished placeholders. My GitHub activity is public in the meantime."
              action={
                github ? (
                  <Button href={github} variant="secondary" target="_blank" rel="noopener noreferrer">
                    <GitHubIcon className="h-[15px] w-[15px]" /> View GitHub activity
                  </Button>
                ) : undefined
              }
            />
          </Reveal>
        ) : (
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => {
              const image = storageUrl('images', project.image_path)
              return (
                <Reveal key={project.id} delay={(index % 3) * 80}>
                  <Card className="flex h-full flex-col overflow-hidden p-0">
                    <div className="relative aspect-[16/10] overflow-hidden border-b border-white/[0.06] bg-[#070b14]">
                      {image ? (
                        <img
                          src={image}
                          alt={`Screenshot of ${project.title}`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="bg-dot flex h-full w-full items-center justify-center opacity-60">
                          <FolderGit2 size={30} className="text-slate-600" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-[16px] font-semibold text-white">{project.title}</h3>
                      <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
                        {project.summary}
                      </p>

                      {project.tech_stack.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {project.tech_stack.map((tech) => (
                            <span key={tech} className="chip text-[10.5px]">
                              {tech}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      <div className="mt-auto flex gap-2 pt-5">
                        {project.github_url ? (
                          <a
                            href={absoluteUrl(project.github_url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-400 transition-colors hover:text-white"
                          >
                            <GitHubIcon className="h-[13px] w-[13px]" /> Code
                          </a>
                        ) : null}
                        {project.live_url ? (
                          <a
                            href={absoluteUrl(project.live_url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              'inline-flex items-center gap-1.5 text-[12px] font-medium transition-colors hover:text-white',
                              project.github_url ? 'ml-4 text-slate-400' : 'text-slate-400',
                            )}
                          >
                            Live demo <ArrowUpRight size={13} />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </Card>
                </Reveal>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
