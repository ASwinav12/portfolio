'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Award,
  Briefcase,
  ExternalLink,
  FileText,
  FolderGit2,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Terminal,
  User,
  X,
} from 'lucide-react'
import { signOut } from '@/actions/_shared'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/profile', label: 'Profile & photo', icon: User },
  { href: '/admin/education', label: 'Education', icon: GraduationCap },
  { href: '/admin/experience', label: 'Experience', icon: Briefcase },
  { href: '/admin/skills', label: 'Skills', icon: ListChecks },
  { href: '/admin/training', label: 'DevOps training', icon: Terminal },
  { href: '/admin/projects', label: 'Projects', icon: FolderGit2 },
  { href: '/admin/certificates', label: 'Certificates', icon: Award },
  { href: '/admin/messages', label: 'Messages', icon: Inbox },
  { href: '/admin/resume', label: 'Resume', icon: FileText },
]

export function AdminShell({ children, email }: { children: React.ReactNode; email: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const current =
    NAV.find((item) =>
      item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href),
    ) ?? NAV[0]

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <div className="min-h-screen bg-[#04060c]">
      {/* sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/[0.07] bg-[#070b14] lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-white/[0.07] px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-500/40 bg-brand-500/10 font-mono text-[11px] font-semibold text-cyan-300">
            {'</>'}
          </span>
          <div>
            <p className="text-[13px] font-semibold tracking-[0.06em] text-white">ASWIN A V</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-600">
              Admin dashboard
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {NAV.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors',
                  active
                    ? 'border border-white/[0.08] bg-white/[0.06] text-cyan-300'
                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-white',
                )}
              >
                <item.icon size={15} strokeWidth={1.8} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-white/[0.07] p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-[12.5px] text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            <ExternalLink size={14} /> View public site
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[12.5px] text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut size={14} /> Sign out
            </button>
          </form>
          <p className="mt-2 truncate px-3 text-[10px] text-slate-600">{email}</p>
        </div>
      </aside>

      {/* mobile header */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/[0.07] bg-[#070b14]/90 px-4 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-brand-500/40 bg-brand-500/10 font-mono text-[10px] text-cyan-300">
            {'</>'}
          </span>
          <span className="text-[13px] font-semibold text-white">Admin</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-slate-300"
          aria-label="Open admin menu"
        >
          <Menu size={18} />
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-white/[0.08] bg-[#070b14]">
            <div className="flex h-14 items-center justify-between border-b border-white/[0.07] px-4">
              <span className="text-[13px] font-semibold text-white">Admin dashboard</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400"
                aria-label="Close admin menu"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium',
                    isActive(item.href)
                      ? 'bg-white/[0.06] text-cyan-300'
                      : 'text-slate-400 hover:bg-white/[0.04] hover:text-white',
                  )}
                >
                  <item.icon size={15} /> {item.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-white/[0.07] p-3">
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[12.5px] text-slate-400 hover:text-red-300"
                >
                  <LogOut size={14} /> Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <h1 className="mb-6 text-2xl font-semibold tracking-tight text-white">
            {current.label}
          </h1>
          {children}
        </main>
      </div>
    </div>
  )
}
