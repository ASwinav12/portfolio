import { getSiteContent } from '@/lib/content'
import { ResumeManager } from '@/components/admin/ResumeManager'

export const dynamic = 'force-dynamic'

export default async function AdminResumePage() {
  const { profile } = await getSiteContent()
  return <ResumeManager profile={profile} />
}
