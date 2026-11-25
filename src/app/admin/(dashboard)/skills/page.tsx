import { getSiteContent } from '@/lib/content'
import { SkillsManager } from '@/components/admin/SkillsManager'

export const dynamic = 'force-dynamic'

export default async function AdminSkillsPage() {
  const { skills } = await getSiteContent()
  return <SkillsManager items={skills} />
}
