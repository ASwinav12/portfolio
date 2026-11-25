import { getSiteContent } from '@/lib/content'
import { TrainingManager } from '@/components/admin/TrainingManager'

export const dynamic = 'force-dynamic'

export default async function AdminTrainingPage() {
  const { trainingModules } = await getSiteContent()
  return <TrainingManager items={trainingModules} />
}
