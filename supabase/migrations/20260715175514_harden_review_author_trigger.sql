create or replace function private.set_review_author()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requesting_user uuid := (select auth.uid());
begin
  if requesting_user is not null and requesting_user <> new.user_id then
    raise exception 'A review cannot be written for another user.' using errcode = '42501';
  end if;

  select display_name into new.author_name
  from public.profiles
  where id = new.user_id;

  new.author_name = coalesce(new.author_name, 'Beer lover');
  return new;
end;
$$;

revoke all on function private.set_review_author() from public, anon, authenticated;
