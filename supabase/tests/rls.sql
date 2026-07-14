begin;

create extension if not exists pgtap with schema extensions;
select plan(7);

insert into auth.users (id, email, aud, role, raw_user_meta_data, raw_app_meta_data, created_at, updated_at)
values
  ('11111111-1111-4111-8111-111111111111', 'owner-one@example.test', 'authenticated', 'authenticated', '{"display_name":"Owner one"}', '{}', now(), now()),
  ('22222222-2222-4222-8222-222222222222', 'owner-two@example.test', 'authenticated', 'authenticated', '{"display_name":"Owner two"}', '{}', now(), now());

insert into public.ledger_entries (user_id, beer_id)
values
  ('11111111-1111-4111-8111-111111111111', (select id from public.beers order by id limit 1)),
  ('22222222-2222-4222-8222-222222222222', (select id from public.beers order by id limit 1 offset 1));

set local role authenticated;
select set_config('request.jwt.claim.sub', '11111111-1111-4111-8111-111111111111', true);

select is((select count(*) from public.ledger_entries), 1::bigint, 'a user sees only their own Ledger rows');
select is((select count(*) from public.profiles), 1::bigint, 'a user sees only their own profile');
select is(
  (with removed as (
    delete from public.ledger_entries
    where user_id = '22222222-2222-4222-8222-222222222222'
    returning user_id
  ) select count(*) from removed),
  0::bigint,
  'a user cannot delete another user Ledger row'
);
select is(
  (with changed as (
    update public.profiles
    set display_name = 'Unauthorized change'
    where id = '22222222-2222-4222-8222-222222222222'
    returning id
  ) select count(*) from changed),
  0::bigint,
  'a user cannot update another user profile'
);
select throws_ok(
  $$insert into public.ledger_entries (user_id, beer_id)
    values ('22222222-2222-4222-8222-222222222222', (select id from public.beers order by id limit 1 offset 2))$$,
  '42501',
  'new row violates row-level security policy for table "ledger_entries"',
  'a user cannot insert a Ledger row owned by another user'
);
select lives_ok(
  $$update public.profiles set display_name = 'Owner one updated'
    where id = '11111111-1111-4111-8111-111111111111'$$,
  'a user can update their own profile'
);
select lives_ok(
  $$delete from public.ledger_entries
    where user_id = '11111111-1111-4111-8111-111111111111'$$,
  'a user can remove their own Ledger row'
);

select * from finish();
rollback;
