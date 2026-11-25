import { createClient } from '@/lib/supabase/server'
import { MessagesManager } from '@/components/admin/MessagesManager'
import type { ContactMessage } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function AdminMessagesPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  return <MessagesManager items={(data ?? []) as ContactMessage[]} />
}
