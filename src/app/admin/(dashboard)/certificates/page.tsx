import { getSiteContent } from '@/lib/content'
import { CertificatesManager } from '@/components/admin/CertificatesManager'

export const dynamic = 'force-dynamic'

export default async function AdminCertificatesPage() {
  const { certificates } = await getSiteContent()
  return <CertificatesManager items={certificates} />
}
