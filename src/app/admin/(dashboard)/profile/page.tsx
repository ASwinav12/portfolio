import { getSiteContent } from '@/lib/content'
import { ProfileManager } from '@/components/admin/ProfileManager'

export const dynamic = 'force-dynamic'

export default async function AdminProfilePage() {
  const { profile } = await getSiteContent()
  return <ProfileManager profile={profile} />
}
