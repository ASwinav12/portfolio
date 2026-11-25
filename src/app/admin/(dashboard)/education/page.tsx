import { getSiteContent } from '@/lib/content'
import { EducationManager } from '@/components/admin/EducationManager'

export const dynamic = 'force-dynamic'

export default async function AdminEducationPage() {
  const { education } = await getSiteContent()
  return <EducationManager items={education} />
}
