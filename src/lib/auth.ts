export const OWNER_EMAIL = (process.env.OWNER_EMAIL ?? 'aswinav277@gmail.com').toLowerCase()

export function isOwnerEmail(email?: string | null) {
  return (email ?? '').trim().toLowerCase() === OWNER_EMAIL
}
