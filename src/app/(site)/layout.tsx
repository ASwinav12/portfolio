import { Navbar } from '@/components/site/Navbar'
import { Footer } from '@/components/site/Footer'
import { getProfile } from '@/lib/content'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile()

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer profile={profile} />
    </>
  )
}
