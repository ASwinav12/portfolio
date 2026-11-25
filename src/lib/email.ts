type SendResult =
  | { sent: true; id?: string }
  | { sent: false; reason: 'not_configured' }
  | { sent: false; reason: 'error'; detail: string }

type ContactEmailInput = {
  to: string
  replyTo: string
  name: string
  email: string
  company?: string | null
  enquiryType: string
  subject: string
  message: string
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Delivers a contact enquiry through the Resend HTTP API.
 * The API key lives only in the server environment — never in the browser.
 */
export async function sendContactEmail(input: ContactEmailInput): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return { sent: false, reason: 'not_configured' }

  const from = process.env.CONTACT_FROM_EMAIL ?? 'ASWIN A V Portfolio <onboarding@resend.dev>'

  const text = [
    'New enquiry from your portfolio',
    '',
    `Name:          ${input.name}`,
    `Email:         ${input.email}`,
    `Company:       ${input.company || '—'}`,
    `Enquiry type:  ${input.enquiryType}`,
    `Subject:       ${input.subject}`,
    '',
    'Message:',
    input.message,
  ].join('\n')

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;background:#070b14;padding:32px;color:#e2e8f0">
      <div style="max-width:560px;margin:0 auto;background:#0b1220;border:1px solid #1e293b;border-radius:16px;padding:28px">
        <p style="margin:0 0 4px;color:#60a5fa;font-size:12px;letter-spacing:.14em;text-transform:uppercase">
          New portfolio enquiry · ${escapeHtml(input.enquiryType)}
        </p>
        <h1 style="margin:8px 0 20px;font-size:22px;color:#f8fafc">${escapeHtml(input.subject)}</h1>
        <table style="width:100%;border-collapse:collapse;font-size:14px;color:#cbd5e1">
          <tr><td style="padding:6px 0;color:#64748b;width:110px">Name</td><td>${escapeHtml(input.name)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Email</td><td><a href="mailto:${escapeHtml(input.email)}" style="color:#22d3ee">${escapeHtml(input.email)}</a></td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Company</td><td>${escapeHtml(input.company || '—')}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Type</td><td>${escapeHtml(input.enquiryType)}</td></tr>
        </table>
        <div style="margin-top:20px;padding:16px;background:#070b14;border:1px solid #16233a;border-radius:12px;font-size:14px;line-height:1.6;color:#e2e8f0;white-space:pre-wrap">${escapeHtml(input.message)}</div>
        <p style="margin:20px 0 0;font-size:12px;color:#475569">Reply directly to this email to answer ${escapeHtml(input.name)}.</p>
      </div>
    </div>`

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        reply_to: input.replyTo,
        subject: `[Portfolio] ${input.subject}`,
        text,
        html,
      }),
    })

    if (!response.ok) {
      const detail = await response.text()
      console.error('[email] Resend error:', response.status, detail)
      return { sent: false, reason: 'error', detail: `${response.status} ${detail.slice(0, 300)}` }
    }

    const payload = (await response.json()) as { id?: string }
    return { sent: true, id: payload.id }
  } catch (error) {
    return { sent: false, reason: 'error', detail: (error as Error).message }
  }
}
