'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Lock, Menu, X } from 'lucide-react'
import { GitHubIcon } from '@/components/ui/BrandIcons'
import { cn } from '@/lib/utils'

const PRIMARY = [
  { label: 'About', href: '#about' },
  { label: 'Education', href: '#education' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

const MORE = [
  { label: 'DevOps Training', href: '#training' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Career Interests', href: '#interests' },
  { label: 'Resume', href: '#resume' },
]

const ALL_IDS = [...PRIMARY, ...MORE].map((item) => item.href.slice(1))

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [active, setActive] = useState('')
  const moreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16)
      let current = ''
      for (const id of ALL_IDS) {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top <= 150) current = id
      }
      setActive(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!moreOpen) return
    const onClick = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [moreOpen])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const linkClass = (id: string) =>
    cn(
      'rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors',
      active === id ? 'text-cyan-300' : 'text-slate-400 hover:text-white',
    )

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          scrolled
            ? 'border-b border-white/[0.07] bg-[#04060c]/80 backdrop-blur-xl'
            : 'bg-transparent',
        )}
      >
        <div className="container-page flex h-[68px] items-center justify-between gap-4">
          <Link
            href="#top"
            className="group flex items-center gap-2.5"
            aria-label="ASWIN A V — back to top"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-500/40 bg-brand-500/10 font-mono text-[13px] font-semibold text-cyan-300 transition-colors group-hover:border-cyan-300/50 group-hover:bg-cyan-400/10">
              {'</>'}
            </span>
            <span className="text-[15px] font-semibold tracking-[0.06em] text-white">
              ASWIN A V
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {PRIMARY.map((item) => (
              <a key={item.href} href={item.href} className={linkClass(item.href.slice(1))}>
                {item.label}
              </a>
            ))}

            <div ref={moreRef} className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen((value) => !value)}
                className={cn(
                  'flex items-center gap-1 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors',
                  MORE.some((item) => `#${active}` === item.href)
                    ? 'text-cyan-300'
                    : 'text-slate-400 hover:text-white',
                )}
                aria-expanded={moreOpen}
              >
                More
                <ChevronDown
                  size={14}
                  className={cn('transition-transform', moreOpen && 'rotate-180')}
                />
              </button>

              {moreOpen ? (
                <div className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-white/[0.1] bg-[#080d18]/95 p-1.5 shadow-2xl backdrop-blur-xl">
                  {MORE.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        'block rounded-lg px-3 py-2 text-[13px] transition-colors',
                        active === item.href.slice(1)
                          ? 'bg-white/[0.06] text-cyan-300'
                          : 'text-slate-300 hover:bg-white/[0.05] hover:text-white',
                      )}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <a
              href="https://github.com/ASwinav12"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-slate-400 transition-colors hover:border-white/[0.2] hover:text-white"
              aria-label="GitHub profile"
            >
              <GitHubIcon className="h-4 w-4" />
            </a>
            <Link
              href="/admin"
              className="flex h-9 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-[12.5px] font-medium text-slate-400 transition-colors hover:border-white/[0.2] hover:text-white"
            >
              <Lock size={13} />
              Admin
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-slate-300 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-[#04060c]/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l border-white/[0.08] bg-[#070b14]">
            <div className="flex h-[68px] items-center justify-between border-b border-white/[0.07] px-5">
              <span className="text-[15px] font-semibold tracking-[0.06em] text-white">
                ASWIN A V
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-slate-300"
                aria-label="Close navigation menu"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-5" aria-label="Mobile">
              <p className="mb-2 px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
                Explore
              </p>
              {[...PRIMARY, ...MORE].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'block rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors',
                    active === item.href.slice(1)
                      ? 'bg-white/[0.06] text-cyan-300'
                      : 'text-slate-300 hover:bg-white/[0.05] hover:text-white',
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="border-t border-white/[0.07] p-4">
              <div className="flex gap-2">
                <a
                  href="https://github.com/ASwinav12"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] text-[13px] font-medium text-slate-200"
                >
                  <GitHubIcon className="h-[15px] w-[15px]" /> GitHub
                </a>
                <Link
                  href="/admin"
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] text-[13px] font-medium text-slate-200"
                >
                  <Lock size={14} /> Admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
