import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0" />
        <div className="absolute left-1/2 top-1/3 h-[420px] w-[520px] -translate-x-1/2 rounded-full bg-brand-600/[0.12] blur-[120px]" />
      </div>

      <div className="relative text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-300">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[14.5px] leading-relaxed text-slate-400">
          The page you are looking for does not exist or has moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 px-5 text-[14px] font-medium text-white transition hover:brightness-110"
        >
          <ArrowLeft size={16} /> Back to portfolio
        </Link>
      </div>
    </div>
  )
}
