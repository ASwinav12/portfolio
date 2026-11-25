'use client'

import { useState, useTransition, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { FileUpload } from '@/components/admin/FileUpload'
import { setProfilePhoto, updateProfile } from '@/actions/profile'
import { storageUrl } from '@/lib/storage'
import type { ActionResult, Profile } from '@/lib/types'

export function ProfileManager({ profile }: { profile: Profile }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [result, setResult] = useState<ActionResult | null>(null)
  const [photoPath, setPhotoPath] = useState<string | null>(profile.photo_path)

  const [form, setForm] = useState({
    full_name: profile.full_name,
    headline: profile.headline,
    about: profile.about ?? '',
    email: profile.email ?? '',
    phone: profile.phone ?? '',
    location: profile.location ?? '',
    availability: profile.availability ?? '',
    github: profile.socials?.github ?? '',
    linkedin: profile.socials?.linkedin ?? '',
    instagram: profile.socials?.instagram ?? '',
  })

  const photoUrl = storageUrl('images', photoPath)

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setResult(null)
    startTransition(async () => {
      const response = await updateProfile(form)
      setResult(response)
      if (response.ok) router.refresh()
    })
  }

  async function onPhotoUploaded(path: string) {
    const response = await setProfilePhoto(path)
    if (response.ok) {
      setPhotoPath(path)
      router.refresh()
    } else {
      setResult(response)
    }
  }

  async function onPhotoRemoved() {
    const response = await setProfilePhoto(null)
    if (response.ok) {
      setPhotoPath(null)
      router.refresh()
    } else {
      setResult(response)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card className="p-6" hover={false}>
        <h2 className="text-[15px] font-medium text-white">Profile photo</h2>
        <p className="mt-1 text-[12.5px] text-slate-500">
          Used in the hero and anywhere the portrait appears. Images are compressed in the browser
          before upload.
        </p>

        <div className="mt-5 grid gap-6 sm:grid-cols-[160px_1fr]">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/[0.1] bg-[#080d18]">
            {photoUrl ? (
              <img src={photoUrl} alt="Profile preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center">
                <span className="text-gradient text-4xl font-semibold">AV</span>
                <span className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-600">
                  Placeholder
                </span>
              </div>
            )}
          </div>

          <FileUpload
            bucket="images"
            folder="profile"
            label="Upload or replace"
            hint="JPG, PNG or WebP · compressed automatically"
            image
            currentPath={photoPath}
            onUploaded={onPhotoUploaded}
            onRemoved={onPhotoRemoved}
          />
        </div>
      </Card>

      <Card className="p-6" hover={false}>
        <h2 className="text-[15px] font-medium text-white">Identity</h2>
        <div className="mt-5 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="full_name" className="field-label">
                Full name
              </label>
              <input
                id="full_name"
                className="field"
                value={form.full_name}
                onChange={(event) => update('full_name', event.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="headline" className="field-label">
                Headline
              </label>
              <input
                id="headline"
                className="field"
                value={form.headline}
                onChange={(event) => update('headline', event.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="about" className="field-label">
              About me
            </label>
            <textarea
              id="about"
              rows={8}
              className="field resize-y leading-relaxed"
              value={form.about}
              onChange={(event) => update('about', event.target.value)}
            />
            <p className="mt-1.5 text-[11px] text-slate-600">
              Separate paragraphs with a blank line.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6" hover={false}>
        <h2 className="text-[15px] font-medium text-white">Contact details</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="field-label">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="field"
              value={form.email}
              onChange={(event) => update('email', event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="field-label">
              Phone
            </label>
            <input
              id="phone"
              className="field"
              value={form.phone}
              onChange={(event) => update('phone', event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="location" className="field-label">
              Location
            </label>
            <input
              id="location"
              className="field"
              value={form.location}
              onChange={(event) => update('location', event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="availability" className="field-label">
              Availability line
            </label>
            <input
              id="availability"
              className="field"
              value={form.availability}
              onChange={(event) => update('availability', event.target.value)}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6" hover={false}>
        <h2 className="text-[15px] font-medium text-white">Social links</h2>
        <div className="mt-5 grid gap-4">
          {(
            [
              ['github', 'GitHub URL'],
              ['linkedin', 'LinkedIn URL'],
              ['instagram', 'Instagram URL'],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label htmlFor={key} className="field-label">
                {label}
              </label>
              <input
                id={key}
                className="field"
                value={form[key]}
                onChange={(event) => update(key, event.target.value)}
                placeholder="https://"
              />
            </div>
          ))}
        </div>
      </Card>

      <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.1] bg-[#0b1220]/95 p-4 shadow-2xl backdrop-blur">
        <div className="min-w-0">
          {result ? (
            <p
              className={
                result.ok
                  ? 'flex items-center gap-1.5 text-[12.5px] text-emerald-300'
                  : 'text-[12.5px] text-red-400'
              }
            >
              {result.ok ? <CheckCircle2 size={14} /> : null}
              {result.ok ? result.message : result.error}
            </p>
          ) : (
            <p className="text-[12px] text-slate-500">Changes are saved to Supabase instantly.</p>
          )}
        </div>
        <Button type="submit" disabled={pending} className="min-w-[150px]">
          {pending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {pending ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>
  )
}
