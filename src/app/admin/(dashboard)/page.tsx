import Link from 'next/link'
import { Award, Briefcase, FolderGit2, GraduationCap, Inbox, ListChecks, Mail, Plus } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { createClient } from '@/lib/supabase/server'
import { formatDate, truncate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminOverview() {
  const supabase = await createClient()

  const [projects, certificates, skills, education, experience, training, messages] =
    await Promise.all([
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('certificates').select('id', { count: 'exact', head: true }),
      supabase.from('skills').select('id', { count: 'exact', head: true }),
      supabase.from('education').select('id', { count: 'exact', head: true }),
      supabase.from('experience').select('id', { count: 'exact', head: true }),
      supabase.from('training_modules').select('id', { count: 'exact', head: true }),
      supabase
        .from('contact_messages')
        .select('id, name, email, subject, enquiry_type, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5),
    ])

  const stats = [
    { label: 'Projects', value: projects.count ?? 0, icon: FolderGit2, href: '/admin/projects' },
    { label: 'Skills', value: skills.count ?? 0, icon: ListChecks, href: '/admin/skills' },
    { label: 'Education', value: education.count ?? 0, icon: GraduationCap, href: '/admin/education' },
    { label: 'Experience', value: experience.count ?? 0, icon: Briefcase, href: '/admin/experience' },
    { label: 'Training modules', value: training.count ?? 0, icon: ListChecks, href: '/admin/training' },
    { label: 'Certificates', value: certificates.count ?? 0, icon: Award, href: '/admin/certificates' },
  ]

  const recent = messages.data ?? []

  return (
    <div className="space-y-8">
      <Card className="p-6" hover={false}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
              Content is live
            </p>
            <h2 className="mt-1 text-lg font-semibold text-white">
              Everything you save here appears on the public site.
            </h2>
            <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-slate-400">
              No commit or redeploy is needed for content changes. Source-code changes are still
              managed through GitHub.
            </p>
          </div>
          <Link
            href="/"
            target="_blank"
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 text-[13px] font-medium text-slate-200 transition-colors hover:border-white/[0.24]"
          >
            Open public site
          </Link>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.09] bg-white/[0.03] text-cyan-300">
                  <stat.icon size={16} />
                </span>
                <span className="text-2xl font-semibold text-white">{stat.value}</span>
              </div>
              <p className="mt-3 text-[12.5px] text-slate-400">{stat.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <Card className="p-6" hover={false}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Inbox size={16} className="text-cyan-300" />
              <h2 className="text-[15px] font-medium text-white">Recent enquiries</h2>
            </div>
            <Link
              href="/admin/messages"
              className="text-[12px] font-medium text-cyan-300 hover:text-cyan-200"
            >
              View all
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-white/[0.1] px-4 py-10 text-center">
              <Mail size={22} className="mx-auto text-slate-600" />
              <p className="mt-3 text-[13px] text-slate-500">No enquiries yet.</p>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-white/[0.06]">
              {recent.map((message) => (
                <li key={message.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-medium text-slate-200">
                        {message.name}
                        <span className="ml-2 text-[11.5px] font-normal text-slate-500">
                          {message.email}
                        </span>
                      </p>
                      <p className="mt-0.5 truncate text-[12.5px] text-slate-400">
                        {message.subject}
                      </p>
                    </div>
                    <Badge tone={message.status === 'new' ? 'Currently Learning' : undefined}>
                      {message.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-600">
                    {formatDate(message.created_at)} · {message.enquiry_type}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-6" hover={false}>
          <h2 className="text-[15px] font-medium text-white">Quick actions</h2>
          <div className="mt-4 space-y-2">
            {[
              { href: '/admin/projects', label: 'Add a project', icon: Plus },
              { href: '/admin/certificates', label: 'Add a certificate', icon: Plus },
              { href: '/admin/profile', label: 'Update profile photo', icon: Plus },
              { href: '/admin/resume', label: 'Replace resume PDF', icon: Plus },
            ].map((action) => (
              <Link
                key={action.href + action.label}
                href={action.href}
                className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5 text-[13px] text-slate-300 transition-colors hover:border-white/[0.16] hover:bg-white/[0.05] hover:text-white"
              >
                <action.icon size={14} className="text-cyan-300" /> {action.label}
              </Link>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
            <p className="text-[11.5px] leading-relaxed text-slate-500">
              Projects and certificates start empty on purpose — add them only when they are real
              and verifiable.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
