'use client'

import { useRef, useState } from 'react'
import { CheckCircle2, ImagePlus, Loader2, Trash2, UploadCloud } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { storageUrl } from '@/lib/storage'
import { cn } from '@/lib/utils'

type Props = {
  bucket: 'images' | 'documents'
  folder: string
  label: string
  hint?: string
  accept?: string
  image?: boolean
  currentPath?: string | null
  onUploaded: (path: string) => void | Promise<void>
  onRemoved?: () => void | Promise<void>
  className?: string
}

const MAX_BYTES = 10 * 1024 * 1024

function safeName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
}

async function compressImage(file: File, maxDimension = 1400): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) return file
    context.drawImage(bitmap, 0, 0, width, height)
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Could not compress image'))),
        'image/jpeg',
        0.86,
      )
    })
  } catch {
    return file
  }
}

export function FileUpload({
  bucket,
  folder,
  label,
  hint,
  accept = 'image/*',
  image = false,
  currentPath,
  onUploaded,
  onRemoved,
  className,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const currentUrl = storageUrl(bucket, currentPath)

  async function handleFile(file: File) {
    setError('')
    if (file.size > MAX_BYTES) {
      setError('File is too large. Maximum size is 10 MB.')
      return
    }

    setBusy(true)
    try {
      const supabase = createClient()
      let payload: Blob = file
      let extension = file.name.split('.').pop()?.toLowerCase() || 'bin'

      if (image) {
        payload = await compressImage(file)
        extension = 'jpg'
      }

      const baseName = file.name.replace(/\.[^.]+$/, '') || 'file'
      const path = `${folder}/${Date.now()}-${safeName(baseName)}.${extension}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, payload, {
          contentType: image ? 'image/jpeg' : file.type,
          upsert: false,
        })

      if (uploadError) throw uploadError

      // Remove the previous file once the new one is safely stored.
      if (currentPath) {
        await supabase.storage.from(bucket).remove([currentPath])
      }

      await onUploaded(path)
    } catch (err) {
      setError((err as Error).message || 'Upload failed.')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleRemove() {
    setBusy(true)
    setError('')
    try {
      if (currentPath) {
        const supabase = createClient()
        await supabase.storage.from(bucket).remove([currentPath])
      }
      await onRemoved?.()
    } catch (err) {
      setError((err as Error).message || 'Could not remove the file.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      <p className="field-label">{label}</p>

      <div
        onDragOver={(event) => {
          event.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragOver(false)
          const file = event.dataTransfer.files?.[0]
          if (file) handleFile(file)
        }}
        className={cn(
          'flex flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8 text-center transition-colors',
          dragOver
            ? 'border-cyan-300/50 bg-cyan-300/[0.05]'
            : 'border-white/[0.12] bg-white/[0.02]',
        )}
      >
        {busy ? (
          <Loader2 size={24} className="animate-spin text-cyan-300" />
        ) : image ? (
          <ImagePlus size={24} className="text-slate-500" />
        ) : (
          <UploadCloud size={24} className="text-slate-500" />
        )}

        <p className="mt-3 text-[13px] text-slate-300">
          {busy ? 'Uploading…' : 'Drag and drop, or'}
          {!busy ? (
            <>
              {' '}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="font-medium text-cyan-300 hover:text-cyan-200"
              >
                browse files
              </button>
            </>
          ) : null}
        </p>
        <p className="mt-1 text-[11px] text-slate-600">{hint ?? 'Max 10 MB'}</p>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) handleFile(file)
          }}
        />
      </div>

      {error ? <p className="text-[11.5px] text-red-400">{error}</p> : null}

      {currentPath ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
            <div className="min-w-0">
              {currentUrl && image ? (
                <img
                  src={currentUrl}
                  alt="Current upload preview"
                  className="h-10 w-10 shrink-0 rounded-lg object-cover"
                />
              ) : null}
              <p className="truncate text-[11.5px] text-slate-400">{currentPath.split('/').pop()}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {currentUrl ? (
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11.5px] font-medium text-cyan-300 hover:text-cyan-200"
              >
                Open
              </a>
            ) : null}
            {onRemoved ? (
              <button
                type="button"
                onClick={handleRemove}
                disabled={busy}
                className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-300"
                aria-label="Remove file"
              >
                <Trash2 size={14} />
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
