-- ============================================================================
-- Restrict authentication sign-up to the portfolio owner
-- ----------------------------------------------------------------------------
-- Public sign-up stays enabled in Supabase so the owner can create their
-- account from /admin/setup once. This trigger guarantees that no other email
-- address can ever create an account, even if someone calls the Auth API
-- directly with the anon key.
--
-- To allow another admin in future, drop this trigger and update the owner
-- allow-list in the RLS helper `public.is_admin()`.
-- ============================================================================

create or replace function public.restrict_owner_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if lower(coalesce(new.email, '')) <> 'aswinav277@gmail.com' then
    raise exception 'Sign-up is restricted to the portfolio owner.'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists restrict_owner_signup on auth.users;
create trigger restrict_owner_signup
  before insert on auth.users
  for each row execute function public.restrict_owner_signup();
