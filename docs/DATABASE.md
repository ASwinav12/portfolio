# Database & RLS reference

Project: `aswin-av-portfolio` (`ap-south-1`)

## Tables

| Table | Purpose | Public read | Public write |
|---|---|---|---|
| `profile` | Single row — name, headline, about, contact, socials, photo, resume | ✅ | ❌ |
| `education` | Diploma / degree records | ✅ | ❌ |
| `experience` | Internships and training programmes | ✅ | ❌ |
| `skills` | Categorised skills with honest proficiency labels | ✅ | ❌ |
| `training_modules` | DevOps & Cloud curriculum cards | ✅ | ❌ |
| `projects` | Portfolio projects | ✅ | ❌ |
| `certificates` | Certificates + uploaded files | ✅ | ❌ |
| `contact_messages` | Enquiries from the public form | ❌ | insert only |

## Owner check

```sql
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'aswinav277@gmail.com'
     and coalesce(auth.jwt() ->> 'role', '') = 'authenticated';
$$;
```

Every write policy uses `public.is_admin()` in both `using` and `with check`.

## Policies

**Public read** — `select` with `using (true)` on `profile`, `education`,
`experience`, `skills`, `training_modules`, `projects`, `certificates`.

**Owner write** — `for all using (is_admin()) with check (is_admin())` on the same tables.

**Contact messages**

- `insert` → `to anon` only (the server route uses the anon key)
- `select`, `update`, `delete` → authenticated owner only

## Sign-up restriction

`0002_restrict_signup.sql` adds a `before insert` trigger on `auth.users` that
raises an exception unless the email is the owner's. This prevents anyone from
creating an account even if they call the Auth API directly.

## Storage

| Bucket | Contents | Read | Write |
|---|---|---|---|
| `images` | Profile photo, project screenshots | public | owner only |
| `documents` | Resume PDF, certificate files | public | owner only |

Policies live on `storage.objects` and check `bucket_id` plus `public.is_admin()`.

## Validation

- Zod schemas in `src/lib/validation.ts` validate every admin action and the contact form.
- Database `check` constraints guard lengths, email format and enum values on `contact_messages`.
- Uploads are limited to 10 MB client-side; Supabase's global file-size limit also applies.

## No service role

The application only ever uses the publishable key plus the visitor's session.
The `service_role` key is not required anywhere in this codebase.
