import { NextResponse } from 'next/server'
import { createHash } from 'node:crypto'
import { createClient } from '@/lib/supabase/server'
import { contactSchema } from '@/lib/validation'
import { sendContactEmail } from '@/lib/email'

export const runtime = 'nodejs'

const WINDOW_MINUTES = 10
const MAX_PER_WINDOW = 3

function hashIp(ip: string) {
  const salt = process.env.RATE_LIMIT_SALT ?? 'aswin-av-portfolio-contact'
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex')
}

function clientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return request.headers.get('x-real-ip') ?? 'unknown'
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    const fields: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.')
      if (!fields[key]) fields[key] = issue.message
    }
    return NextResponse.json(
      { ok: false, error: 'Please check the highlighted fields.', fields },
      { status: 422 },
    )
  }

  const data = parsed.data

  // Honeypot: silently accept so bots cannot tell they were caught.
  if (data.website) {
    return NextResponse.json({ ok: true, emailed: false })
  }

  const ip = clientIp(request)
  const ipHash = hashIp(ip)

  try {
    const supabase = await createClient()

    // --- abuse protection: max 3 enquiries per IP per 10 minutes ----------
    const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString()
    const { count, error: countError } = await supabase
      .from('contact_messages')
      .select('id', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .gte('created_at', since)

    if (countError) {
      console.error('[contact] rate-limit query failed:', countError.message)
    } else if ((count ?? 0) >= MAX_PER_WINDOW) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Too many messages in a short time. Please wait a few minutes and try again.',
        },
        { status: 429 },
      )
    }

    // --- persist first: an enquiry is never lost, even if email fails -----
    const { error: insertError } = await supabase.from('contact_messages').insert({
      name: data.name,
      email: data.email,
      company: data.company || null,
      enquiry_type: data.enquiryType,
      subject: data.subject,
      message: data.message,
      ip_hash: ipHash,
      status: 'new',
    })

    if (insertError) {
      console.error('[contact] insert failed:', insertError.message)
      return NextResponse.json(
        { ok: false, error: 'Your message could not be saved. Please email me directly.' },
        { status: 502 },
      )
    }

    // --- then attempt delivery -------------------------------------------
    const to = process.env.CONTACT_TO_EMAIL ?? 'aswinav277@gmail.com'
    const result = await sendContactEmail({
      to,
      replyTo: data.email,
      name: data.name,
      email: data.email,
      company: data.company,
      enquiryType: data.enquiryType,
      subject: data.subject,
      message: data.message,
    })

    if (result.sent === false && result.reason === 'error') {
      console.error('[contact] email delivery failed:', result.detail)
    }

    const emailStatus =
      result.sent === true ? 'sent' : result.reason === 'not_configured' ? 'not_configured' : 'error'

    return NextResponse.json({
      ok: true,
      emailed: result.sent,
      emailStatus,
    })
  } catch (error) {
    console.error('[contact] unexpected error:', error)
    return NextResponse.json(
      { ok: false, error: 'Something went wrong. Please try again or email me directly.' },
      { status: 500 },
    )
  }
}
