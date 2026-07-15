revoke all on public.reviews from anon, authenticated;
revoke all on sequence public.reviews_id_seq from anon, authenticated;

grant select on public.reviews to anon, authenticated;
grant insert (user_id, beer_id, rating, body) on public.reviews to authenticated;
grant update (rating, body) on public.reviews to authenticated;
grant delete on public.reviews to authenticated;
grant usage, select on sequence public.reviews_id_seq to authenticated;
