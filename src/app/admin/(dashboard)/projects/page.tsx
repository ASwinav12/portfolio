import { getSiteContent } from '@/lib/content'
import { ProjectsManager } from '@/components/admin/ProjectsManager'

export const dynamic = 'force-dynamic'

export default async function AdminProjectsPage() {
  const { projects } = await getSiteContent()
  return <ProjectsManager items={projects} />
}
