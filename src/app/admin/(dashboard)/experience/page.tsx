import { getSiteContent } from '@/lib/content'
import { ExperienceManager } from '@/components/admin/ExperienceManager'

export const dynamic = 'force-dynamic'

export default async function AdminExperiencePage() {
  const { experience } = await getSiteContent()
  return <ExperienceManager items={experience} />
}
