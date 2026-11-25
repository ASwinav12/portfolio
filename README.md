# ASWIN A V — Portfolio

A premium, job-focused personal portfolio for **ASWIN A V** — Aspiring DevOps Engineer & Cloud Computing Enthusiast.

Built with **Next.js 15**, **TypeScript**, **Tailwind CSS** and **Supabase**, deployed on **Vercel**.

---

## What is included

| Area | Details |
|---|---|
| Public site | Hero, About, Education, Experience, DevOps Training, Skills, Projects, Certifications, Career Interests, Resume, Contact |
| Content management | Private admin dashboard for every section — no code edits or commits needed |
| Backend | Supabase Postgres with Row Level Security on every table |
| Auth | Supabase Auth (email + password), owner-only access, sign-up restricted to one email |
| Storage | Separate `images` and `documents` buckets with owner-only write policies |
| Contact | Validated, rate-limited, spam-protected form → database + optional Resend email |
| SEO | Metadata, Open Graph, JSON-LD `Person`, sitemap, robots, manifest |
| Resume | ATS-friendly web view + downloadable PDF managed from the dashboard |

## Tech stack

- **Next.js 15.5** (App Router, Server Components, Server Actions, Route Handlers)
- **React 19** + **TypeScript 5**
- **Tailwind CSS 3.4** with a custom dark theme
- **Supabase** — Auth, Postgres, Storage (`@supabase/ssr`, `@supabase/supabase-js`)
- **lucide-react** icons, self-hosted Inter / JetBrains Mono via Fontsource
- **Vercel** for hosting

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open <http://localhost:3000>.

### Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | browser + server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | browser + server | Publishable / anon key — safe to expose, RLS does the enforcement |
| `OWNER_EMAIL` | server only | The only email allowed into the admin dashboard |
| `RESEND_API_KEY` | server only | Optional — enables contact-form email delivery |
| `CONTACT_FROM_EMAIL` | server only | Verified Resend sender |
| `CONTACT_TO_EMAIL` | server only | Where enquiries are delivered |
| `NEXT_PUBLIC_SITE_URL` | browser + server | Canonical URL used in metadata / sitemap |

> The `service_role` key is **never** used by the application and must never be committed.

## Creating the admin account

1. Open `/admin/setup` in the browser.
2. The email is pre-filled with `OWNER_EMAIL` and locked.
3. Choose a password of at least 10 characters and submit.
4. You are redirected to `/admin`.

Sign-up is restricted at the database level: a trigger on `auth.users` rejects any other email address, and RLS blocks every non-owner from reading or writing admin data.

## Updating content vs. updating code

| Task | How |
|---|---|
| Photo, About, education, experience, skills, projects, certificates, resume, contact details | **Admin dashboard** — saved to Supabase, appears on the site immediately |
| New features, design changes, bug fixes | **GitHub** — commit to a branch, open a PR, merge; Vercel redeploys automatically |

## Scripts

```bash
npm run dev        # local development
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # TypeScript check
```

## Project structure

```
src/
  app/
    (site)/            public pages (home, resume)
    admin/             login, setup and the protected dashboard
    api/contact/       contact form endpoint
    layout.tsx         metadata, fonts, JSON-LD
  components/
    site/              public sections
    admin/             dashboard managers
    ui/                buttons, cards, badges, brand icons
  actions/             Server Actions (all owner-checked)
  lib/                 Supabase clients, content, validation, email
supabase/
  migrations/          0001 schema + policies, 0002 sign-up restriction
  policies/            policy documentation
docs/
  SETUP.md             full setup guide
  DATABASE.md          schema and RLS reference
```

## Documentation

- [Setup guide](docs/SETUP.md)
- [Database & RLS reference](docs/DATABASE.md)
- [Policy documentation](supabase/policies/README.md)

## Security notes

- Every table has RLS enabled; public visitors can only **read** public content.
- Only `OWNER_EMAIL` may write. Authorisation is enforced in SQL, not just in the UI.
- Storage buckets are public-read / owner-write.
- Contact form: server-side validation, honeypot, per-IP rate limiting, and no secrets in the client.
- No `service_role` key, password or private token is stored in this repository.

## License

Personal project of ASWIN A V. All rights reserved.
