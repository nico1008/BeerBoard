create schema if not exists private;

create table public.dataset_releases (
  id bigint generated always as identity primary key,
  slug text not null unique,
  title text not null,
  audited_at timestamptz not null,
  is_demonstration boolean not null default true,
  disclosure text not null,
  created_at timestamptz not null default now()
);

create table public.countries (
  id bigint generated always as identity primary key,
  name text not null unique,
  slug text not null unique,
  iso_code text not null unique check (char_length(iso_code) = 2),
  region text not null,
  summary text not null,
  created_at timestamptz not null default now()
);

create table public.styles (
  id bigint generated always as identity primary key,
  name text not null unique,
  slug text not null unique,
  family text not null,
  summary text not null,
  typical_abv_min numeric(4,1),
  typical_abv_max numeric(4,1),
  typical_ibu_min integer,
  typical_ibu_max integer,
  sensory_profile jsonb not null default '{}'::jsonb,
  related_style_slugs text[] not null default '{}',
  created_at timestamptz not null default now(),
  check (typical_abv_min is null or typical_abv_max is null or typical_abv_min <= typical_abv_max),
  check (typical_ibu_min is null or typical_ibu_max is null or typical_ibu_min <= typical_ibu_max)
);

create table public.breweries (
  id bigint generated always as identity primary key,
  country_id bigint not null references public.countries(id) on delete restrict,
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table public.beers (
  id bigint generated always as identity primary key,
  release_id bigint not null references public.dataset_releases(id) on delete restrict,
  brewery_id bigint not null references public.breweries(id) on delete restrict,
  country_id bigint not null references public.countries(id) on delete restrict,
  style_id bigint not null references public.styles(id) on delete restrict,
  name text not null,
  slug text not null unique,
  description text not null,
  abv numeric(4,1),
  ibu integer,
  calories integer,
  original_gravity numeric(5,3),
  final_gravity numeric(5,3),
  color_srm numeric(4,1),
  created_at timestamptz not null default now(),
  check (abv is null or abv between 0 and 30),
  check (ibu is null or ibu between 0 and 200),
  check (calories is null or calories between 0 and 1000)
);

create table public.beer_assessments (
  beer_id bigint primary key references public.beers(id) on delete cascade,
  quality numeric(5,2) not null check (quality between 0 and 100),
  balance numeric(5,2) not null check (balance between 0 and 100),
  distinctiveness numeric(5,2) not null check (distinctiveness between 0 and 100),
  technical_execution numeric(5,2) not null check (technical_execution between 0 and 100),
  aroma numeric(4,1) not null check (aroma between 0 and 10),
  bitterness numeric(4,1) not null check (bitterness between 0 and 10),
  sweetness numeric(4,1) not null check (sweetness between 0 and 10),
  body numeric(4,1) not null check (body between 0 and 10),
  brightness numeric(4,1) not null check (brightness between 0 and 10),
  finish numeric(4,1) not null check (finish between 0 and 10),
  editorial_verdict text not null,
  methodology_note text not null,
  assessed_at timestamptz not null,
  index_score numeric(5,2) generated always as (
    round(
      quality * 0.35 +
      balance * 0.25 +
      distinctiveness * 0.20 +
      technical_execution * 0.20,
      2
    )
  ) stored
);

create table public.descriptors (
  id bigint generated always as identity primary key,
  name text not null unique,
  category text not null
);

create table public.beer_descriptors (
  beer_id bigint not null references public.beers(id) on delete cascade,
  descriptor_id bigint not null references public.descriptors(id) on delete restrict,
  intensity numeric(4,1) not null check (intensity between 0 and 10),
  primary key (beer_id, descriptor_id)
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 60),
  theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ledger_entries (
  user_id uuid not null references auth.users(id) on delete cascade,
  beer_id bigint not null references public.beers(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, beer_id)
);

create index beers_country_id_idx on public.beers(country_id);
create index beers_style_id_idx on public.beers(style_id);
create index beers_brewery_id_idx on public.beers(brewery_id);
create index beer_assessments_index_score_idx on public.beer_assessments(index_score desc);
create index ledger_entries_user_created_idx on public.ledger_entries(user_id, created_at desc);

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(new.email, '@', 1), 'Beer lover')
  );
  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_updated_at() from public, anon, authenticated;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create view public.beer_catalog
with (security_invoker = true)
as
select
  b.id,
  b.name,
  b.slug,
  b.description,
  b.abv,
  b.ibu,
  b.calories,
  b.original_gravity,
  b.final_gravity,
  b.color_srm,
  br.id as brewery_id,
  br.name as brewery_name,
  br.slug as brewery_slug,
  c.id as country_id,
  c.name as country_name,
  c.slug as country_slug,
  c.iso_code,
  c.region,
  s.id as style_id,
  s.name as style_name,
  s.slug as style_slug,
  s.family as style_family,
  a.index_score,
  a.quality,
  a.balance,
  a.distinctiveness,
  a.technical_execution,
  a.aroma,
  a.bitterness,
  a.sweetness,
  a.body,
  a.brightness,
  a.finish,
  a.editorial_verdict,
  a.methodology_note,
  a.assessed_at,
  dense_rank() over (order by a.index_score desc, b.name asc) as global_rank
from public.beers b
join public.breweries br on br.id = b.brewery_id
join public.countries c on c.id = b.country_id
join public.styles s on s.id = b.style_id
join public.beer_assessments a on a.beer_id = b.id;

create view public.country_summaries
with (security_invoker = true)
as
select
  c.id,
  c.name,
  c.slug,
  c.iso_code,
  c.region,
  c.summary,
  count(distinct b.id)::integer as beer_count,
  count(distinct b.brewery_id)::integer as brewery_count,
  round(avg(a.index_score), 2) as average_score,
  (array_agg(b.name order by a.index_score desc, b.name asc) filter (where b.id is not null))[1] as leading_beer_name,
  (array_agg(b.slug order by a.index_score desc, b.name asc) filter (where b.id is not null))[1] as leading_beer_slug
from public.countries c
left join public.beers b on b.country_id = c.id
left join public.beer_assessments a on a.beer_id = b.id
group by c.id;

create view public.style_summaries
with (security_invoker = true)
as
select
  s.id,
  s.name,
  s.slug,
  s.family,
  s.summary,
  s.typical_abv_min,
  s.typical_abv_max,
  s.typical_ibu_min,
  s.typical_ibu_max,
  s.sensory_profile,
  s.related_style_slugs,
  count(b.id)::integer as beer_count,
  round(avg(a.index_score), 2) as average_score,
  (array_agg(b.name order by a.index_score desc, b.name asc) filter (where b.id is not null))[1] as leading_beer_name,
  (array_agg(b.slug order by a.index_score desc, b.name asc) filter (where b.id is not null))[1] as leading_beer_slug
from public.styles s
left join public.beers b on b.style_id = s.id
left join public.beer_assessments a on a.beer_id = b.id
group by s.id;

alter table public.dataset_releases enable row level security;
alter table public.countries enable row level security;
alter table public.styles enable row level security;
alter table public.breweries enable row level security;
alter table public.beers enable row level security;
alter table public.beer_assessments enable row level security;
alter table public.descriptors enable row level security;
alter table public.beer_descriptors enable row level security;
alter table public.profiles enable row level security;
alter table public.ledger_entries enable row level security;

create policy "Dataset releases are publicly readable"
on public.dataset_releases for select to anon, authenticated using (true);
create policy "Countries are publicly readable"
on public.countries for select to anon, authenticated using (true);
create policy "Styles are publicly readable"
on public.styles for select to anon, authenticated using (true);
create policy "Breweries are publicly readable"
on public.breweries for select to anon, authenticated using (true);
create policy "Beers are publicly readable"
on public.beers for select to anon, authenticated using (true);
create policy "Assessments are publicly readable"
on public.beer_assessments for select to anon, authenticated using (true);
create policy "Descriptors are publicly readable"
on public.descriptors for select to anon, authenticated using (true);
create policy "Beer descriptors are publicly readable"
on public.beer_descriptors for select to anon, authenticated using (true);

create policy "Users can read their own profile"
on public.profiles for select to authenticated
using ((select auth.uid()) = id);
create policy "Users can update their own profile"
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Users can read their own ledger"
on public.ledger_entries for select to authenticated
using ((select auth.uid()) = user_id);
create policy "Users can add to their own ledger"
on public.ledger_entries for insert to authenticated
with check ((select auth.uid()) = user_id);
create policy "Users can remove from their own ledger"
on public.ledger_entries for delete to authenticated
using ((select auth.uid()) = user_id);

revoke all on all tables in schema public from anon, authenticated;
grant select on public.dataset_releases, public.countries, public.styles, public.breweries,
  public.beers, public.beer_assessments, public.descriptors, public.beer_descriptors,
  public.beer_catalog, public.country_summaries, public.style_summaries
to anon, authenticated;
grant select on public.profiles to authenticated;
grant update (display_name, theme) on public.profiles to authenticated;
grant select, insert, delete on public.ledger_entries to authenticated;

revoke all on schema private from public, anon, authenticated;
