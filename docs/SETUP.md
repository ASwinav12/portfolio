# Setup guide

This project has two independent layers:

1. **Content** — lives in Supabase, edited through `/admin`.
2. **Code** — lives in this GitHub repository, deployed by Vercel.

---

## 1. Supabase

A project named `aswin-av-portfolio` is used (region `ap-south-1`, Mumbai).

Schema and policies are applied through migrations:

| File | Contents |
|---|---|
| `supabase/migrations/0001_init.sql` | Tables, RLS, storage buckets, seed content |
| `supabase/migrations/0002_restrict_signup.sql` | Sign-up restricted to the owner email |

To apply them to a fresh project, run the SQL in the Supabase SQL Editor in order.

### Keys

| Key | Used by | Safe to expose? |
|---|---|---|
| Publishable / anon | Browser + server (`NEXT_PUBLIC_*`) | Yes — RLS enforces access |
| `service_role` | Nothing in this app | **Never** — full database access |

If you rotate the publishable key, update it in Vercel and redeploy.

---

## 2. Create the owner account

1. Visit `https://<your-site>/admin/setup`.
2. Confirm the email shown is `aswinav277@gmail.com` (it is locked).
3. Set a password of at least 10 characters.
4. Submit — you are signed in and redirected to `/admin`.

Sign-up is open only until the account exists. After that you can disable public
sign-up entirely in **Supabase → Authentication → Providers → Email**
(“Enable email sign-up”). The database trigger already blocks every other email.

---

## 3. Contact form email delivery

The contact form **always** stores the enquiry in the `contact_messages` table.
Email delivery is an additional step, handled server-side by
`src/app/api/contact/route.ts` + `src/lib/email.ts` using the Resend HTTP API.

### Why a separate provider?

The Gmail connector available in this workspace can send mail from an agent
session, but a public website needs an HTTP API that a server can call with a
secret key. Resend provides exactly that, with a free tier of 3,000
emails/month.

### Steps

1. Create a free account at <https://resend.com>.
2. (Recommended) Verify your own sending domain under **Domains**.
   For a quick start, Resend also provides `onboarding@resend.dev`, which can
   only deliver to the email address that owns the Resend account — which is
   fine for a personal portfolio.
3. Create an API key at <https://resend.com/api-keys> with **Sending access**
   only. You do not need full access.
4. In Vercel → Project → Settings → Environment Variables add:

   | Key | Value | Environments |
   |---|---|---|
   | `RESEND_API_KEY` | the key from Resend | Production, Preview |
   | `CONTACT_FROM_EMAIL` | `ASWIN A V Portfolio <onboarding@resend.dev>` | Production, Preview |
   | `CONTACT_TO_EMAIL` | `aswinav277@gmail.com` | Production, Preview |

5. Redeploy.

> **Never paste the Resend key into chat or commit it.** Add it directly in
> Vercel. It is read only by the server (`process.env.RESEND_API_KEY`).

Until `RESEND_API_KEY` is set, the form still works: enquiries are saved and
shown in **Admin → Messages**, and the visitor is told email delivery is not
configured yet.

---

## 4. Vercel

### Environment variables

| Key | Type | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Plain | `https://<ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Plain | publishable key |
| `OWNER_EMAIL` | Plain | `aswinav277@gmail.com` |
| `RESEND_API_KEY` | Sensitive | only if using Resend |
| `CONTACT_FROM_EMAIL` | Plain | optional |
| `CONTACT_TO_EMAIL` | Plain | optional |
| `NEXT_PUBLIC_SITE_URL` | Plain | production URL |

### Build settings

- Framework preset: **Next.js**
- Build command: `next build`
- Output directory: `.next`
- Node.js 20+

### Deployment flow

- Pushes to the production branch deploy to production.
- Pull requests deploy to a preview URL.
- Content changes in Supabase do **not** need a deployment.

---

## 5. Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

If Supabase is unreachable (for example offline), the public pages fall back to
the seeded content in `src/lib/content.ts`, so the design can still be reviewed.

---

## 6. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `/admin` redirects to `/admin/login` | Not signed in | Sign in at `/admin/login` |
| “This account is not authorised” | Email is not `OWNER_EMAIL` | Use the owner email, or update `OWNER_EMAIL` **and** `public.is_admin()` |
| Upload fails with a policy error | Storage policy blocks the role | Sign in again so the session is refreshed |
| Contact form says email not configured | `RESEND_API_KEY` missing | Add it in Vercel and redeploy |
| Content does not change | Old deployment cached | Hard refresh; server actions call `revalidatePath` |
