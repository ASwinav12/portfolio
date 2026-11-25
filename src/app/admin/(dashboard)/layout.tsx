import { redirect } from 'next/navigation'
import { AdminShell } from '@/components/admin/AdminShell'
import { createClient } from '@/lib/supabase/server'
import { isOwnerEmail } from '@/lib/auth'

export const metadata = {
  title: 'Admin dashboard',
  robots: { index: false, follow: false },
}

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  if (!isOwnerEmail(user.email)) {
    await supabase.auth.signOut()
    redirect('/admin/login?error=unauthorized')
  }

  return <AdminShell email={user.email ?? ''}>{children}</AdminShell>
}
