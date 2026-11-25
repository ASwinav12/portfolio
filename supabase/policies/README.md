# Supabase policies

This folder documents the Row Level Security model. The authoritative SQL lives
in `../migrations/`.

## Summary

| Table | anon SELECT | anon INSERT | owner write |
|---|---|---|---|
| `profile` | ✅ | ❌ | ✅ |
| `education` | ✅ | ❌ | ✅ |
| `experience` | ✅ | ❌ | ✅ |
| `skills` | ✅ | ❌ | ✅ |
| `training_modules` | ✅ | ❌ | ✅ |
| `projects` | ✅ | ❌ | ✅ |
| `certificates` | ✅ | ❌ | ✅ |
| `contact_messages` | ❌ | ✅ | ✅ |

Storage: `images` and `documents` are public-read, owner-write.

## Verifying

Run in the SQL editor:

```sql
-- Should list every policy
select schemaname, tablename, policyname, cmd, roles
from pg_policies
where schemaname in ('public', 'storage')
order by schemaname, tablename;

-- Should be true for all eight tables
select tablename, rowsecurity
from pg_tables
where schemaname = 'public';
```

To confirm an anonymous visitor cannot write:

```sql
begin;
set local role anon;
insert into public.education (degree, institution) values ('x', 'y');
-- ERROR: 42501: new row violates row-level security policy
rollback;
```
