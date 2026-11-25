import { Hero } from '@/components/site/Hero'
import { About } from '@/components/site/About'
import { EducationSection } from '@/components/site/Education'
import { ExperienceSection } from '@/components/site/Experience'
import { TrainingSection } from '@/components/site/Training'
import { SkillsSection } from '@/components/site/Skills'
import { ProjectsSection } from '@/components/site/Projects'
import { CertificationsSection } from '@/components/site/Certifications'
import { CareerInterestsSection } from '@/components/site/CareerInterests'
import { ResumeSection } from '@/components/site/ResumeSection'
import { ContactSection } from '@/components/site/Contact'
import { getSiteContent } from '@/lib/content'
import { storageUrl } from '@/lib/storage'

export const revalidate = 300

export default async function HomePage() {
  const content = await getSiteContent()
  const { profile } = content

  const resumeUrl = storageUrl('documents', profile.resume_path)
  const resumeHref = resumeUrl ?? '/resume'

  return (
    <>
      <Hero profile={profile} resumeHref={resumeHref} />
      <About profile={profile} />
      <EducationSection items={content.education} />
      <ExperienceSection items={content.experience} />
      <TrainingSection modules={content.trainingModules} />
      <SkillsSection skills={content.skills} />
      <ProjectsSection projects={content.projects} profile={profile} />
      <CertificationsSection certificates={content.certificates} />
      <CareerInterestsSection />
      <ResumeSection resumeHref={resumeHref} hasResume={Boolean(resumeUrl)} />
      <ContactSection profile={profile} />
    </>
  )
}
