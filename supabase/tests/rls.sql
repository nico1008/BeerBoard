begin;

create extension if not exists pgtap with schema extensions;
select plan(14);

insert into auth.users (id, email, aud, role, raw_user_meta_data, raw_app_meta_data, created_at, updated_at)
values
  ('11111111-1111-4111-8111-111111111111', 'owner-one@example.test', 'authenticated', 'authenticated', '{"display_name":"Owner one"}', '{}', now(), now()),
  ('22222222-2222-4222-8222-222222222222', 'owner-two@example.test', 'authenticated', 'authenticated', '{"display_name":"Owner two"}', '{}', now(), now());

insert into public.ledger_entries (user_id, beer_id)
values
  ('11111111-1111-4111-8111-111111111111', (select id from public.beers order by id limit 1)),
  ('22222222-2222-4222-8222-222222222222', (select id from public.beers order by id limit 1 offset 1));

insert into public.reviews (user_id, beer_id, rating, body, author_name)
values
  ('11111111-1111-4111-8111-111111111111', (select id from public.beers order by id limit 1), 4, 'Bright, balanced, and easy to return to.', 'Ignored'),
  ('22222222-2222-4222-8222-222222222222', (select id from public.beers order by id limit 1 offset 1), 3, 'Roasty and warming with a lingering finish.', 'Ignored');

set local role authenticated;
select set_config('request.jwt.claim.sub', '11111111-1111-4111-8111-111111111111', true);

select is((select count(*) from public.ledger_entries), 1::bigint, 'a user sees only their own saved beer rows');
select is((select count(*) from public.profiles), 1::bigint, 'a user sees only their own profile');
select is((select count(*) from public.reviews), 2::bigint, 'signed-in users can read public reviews');
select is((select author_name from public.reviews where user_id = '11111111-1111-4111-8111-111111111111'), 'Owner one', 'review author names come from owned profiles');
select is(
  (with removed as (
    delete from public.ledger_entries
    where user_id = '22222222-2222-4222-8222-222222222222'
    returning user_id
  ) select count(*) from removed),
  0::bigint,
  'a user cannot delete another user saved beer row'
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
  'a user cannot insert a saved beer row owned by another user'
);
select lives_ok(
  $$update public.profiles set display_name = 'Owner one updated'
    where id = '11111111-1111-4111-8111-111111111111'$$,
  'a user can update their own profile'
);
select lives_ok(
  $$delete from public.ledger_entries
    where user_id = '11111111-1111-4111-8111-111111111111'$$,
  'a user can remove their own saved beer row'
);

select is(
  (with changed as (
    update public.reviews
    set rating = 1
    where user_id = '22222222-2222-4222-8222-222222222222'
    returning id
  ) select count(*) from changed),
  0::bigint,
  'a user cannot update another user review'
);
select is(
  (with removed as (
    delete from public.reviews
    where user_id = '22222222-2222-4222-8222-222222222222'
    returning id
  ) select count(*) from removed),
  0::bigint,
  'a user cannot delete another user review'
);
select throws_ok(
  $$insert into public.reviews (user_id, beer_id, rating, body, author_name)
    values ('22222222-2222-4222-8222-222222222222', (select id from public.beers order by id limit 1 offset 2), 5, 'A review that must not be accepted.', 'Wrong owner')$$,
  '42501',
  'new row violates row-level security policy for table "reviews"',
  'a user cannot publish a review for another user'
);
select is(
  (with changed as (
    update public.reviews
    set rating = 5, body = 'Even better on a second tasting.'
    where user_id = '11111111-1111-4111-8111-111111111111'
    returning id
  ) select count(*) from changed),
  1::bigint,
  'a user can update their own review'
);

set local role anon;
select is((select count(*) from public.reviews), 2::bigint, 'signed-out visitors can read public reviews');

select * from finish();
rollback;
