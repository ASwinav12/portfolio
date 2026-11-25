'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, ExternalLink, FileText } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { FileUpload } from '@/components/admin/FileUpload'
import { setResume } from '@/actions/profile'
import { storageUrl } from '@/lib/storage'
import type { ActionResult, Profile } from '@/lib/types'

export function ResumeManager({ profile }: { profile: Profile }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [result, setResult] = useState<ActionResult | null>(null)
  const [path, setPath] = useState<string | null>(profile.resume_path)
  const [label, setLabel] = useState<string | null>(profile.resume_label)

  const url = storageUrl('documents', path)

  function apply(nextPath: string | null, nextLabel?: string) {
    startTransition(async () => {
      const response = await setResume(nextPath, nextLabel)
      setResult(response)
      if (response.ok) {
        setPath(nextPath)
        setLabel(nextPath ? (nextLabel ?? 'Resume') : null)
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-5">
      {result ? (
        <p className={`text-[13px] ${result.ok ? 'text-emerald-300' : 'text-red-400'}`}>
          {result.ok ? result.message : result.error}
        </p>
      ) : null}

      <Card className="p-6" hover={false}>
        <h2 className="text-[15px] font-medium text-white">Resume PDF</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-slate-500">
          Upload an ATS-friendly PDF. Every “Download Resume” button on the public site points to
          the latest file stored here.
        </p>

        {url ? (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                <CheckCircle2 size={18} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13px] text-slate-200">{label || 'Resume'}</p>
                <p className="truncate text-[11px] text-slate-600">{path?.split('/').pop()}</p>
              </div>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-cyan-300 hover:text-cyan-200"
            >
              Open PDF <ExternalLink size={12} />
            </a>
          </div>
        ) : (
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-dashed border-white/[0.1] p-4 text-[12.5px] text-slate-500">
            <FileText size={18} className="text-slate-600" />
            No PDF uploaded yet — the public site links to the web resume layout instead.
          </div>
        )}

        <div className="mt-5">
          <FileUpload
            bucket="documents"
            folder="resume"
            label={url ? 'Replace resume PDF' : 'Upload resume PDF'}
            hint="PDF only · max 10 MB"
            accept="application/pdf"
            currentPath={path}
            onUploaded={(nextPath) => apply(nextPath, 'ASWIN A V — Resume')}
            onRemoved={() => apply(null)}
          />
        </div>
      </Card>

      <Card className="p-6" hover={false}>
        <h2 className="text-[15px] font-medium text-white">Tips for an ATS-friendly PDF</h2>
        <ul className="mt-3 list-inside list-disc space-y-1.5 text-[12.5px] leading-relaxed text-slate-400">
          <li>Use a single column and standard fonts — avoid text boxes and graphics.</li>
          <li>Keep section headings simple: Education, Experience, Skills, Projects.</li>
          <li>Export directly from Google Docs or Word as PDF, not as a scanned image.</li>
          <li>Keep it to one or two pages for an entry-level profile.</li>
        </ul>
        <p className="mt-4 text-[11.5px] text-slate-600">
          Uploading is handled by Supabase Storage; only this admin account can write to the
          documents bucket.
        </p>
      </Card>
    </div>
  )
}
