const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

/** Public URL for a file in a public storage bucket. */
export function storageUrl(bucket: 'images' | 'documents', path?: string | null) {
  if (!path) return null
  if (/^https?:\/\//.test(path)) return path
  return `${url}/storage/v1/object/public/${bucket}/${path.replace(/^\/+/, '')}`
}
