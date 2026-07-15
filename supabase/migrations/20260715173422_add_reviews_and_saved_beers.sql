create table public.reviews (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  beer_id bigint not null references public.beers(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  body text not null check (char_length(trim(body)) between 10 and 1000),
  author_name text not null default 'Beer lover' check (char_length(author_name) between 1 and 60),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, beer_id)
);

create index reviews_beer_updated_idx on public.reviews(beer_id, updated_at desc);
create index reviews_user_updated_idx on public.reviews(user_id, updated_at desc);

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

create trigger reviews_set_author
  before insert or update on public.reviews
  for each row execute function private.set_review_author();

create trigger reviews_set_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

alter table public.reviews enable row level security;

create policy "Reviews are publicly readable"
on public.reviews for select to anon, authenticated
using (true);

create policy "Users can publish their own reviews"
on public.reviews for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own reviews"
on public.reviews for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own reviews"
on public.reviews for delete to authenticated
using ((select auth.uid()) = user_id);

revoke all on public.reviews from anon, authenticated;
revoke all on sequence public.reviews_id_seq from anon, authenticated;
grant select on public.reviews to anon, authenticated;
grant insert (user_id, beer_id, rating, body) on public.reviews to authenticated;
grant update (rating, body) on public.reviews to authenticated;
grant delete on public.reviews to authenticated;
grant usage, select on sequence public.reviews_id_seq to authenticated;
