begin;

truncate table public.reviews, public.ledger_entries, public.beer_descriptors, public.descriptors,
  public.beer_assessments, public.beers, public.breweries, public.styles,
  public.countries, public.dataset_releases restart identity cascade;

insert into public.dataset_releases (slug, title, audited_at, is_demonstration, disclosure)
values (
  'global-demo-2026-07',
  'Global Demonstration Catalog — July 2026',
  '2026-07-14T00:00:00Z',
  true,
  'This catalog is fictional demonstration data created to show BeerBoard product behavior. It is not a verified ranking of real beers or breweries.'
);

insert into public.countries (name, slug, iso_code, region, summary) values
  ('Belgium', 'belgium', 'BE', 'Europe', 'A demonstration region spanning abbey-inspired ales, farmhouse fermentation, and fruit-led sour traditions.'),
  ('Germany', 'germany', 'DE', 'Europe', 'A demonstration region centered on precise fermentation, expressive wheat beer, and clean lager profiles.'),
  ('United States', 'united-states', 'US', 'North America', 'A broad demonstration set emphasizing hop expression, dark ales, and contemporary interpretation.'),
  ('United Kingdom', 'united-kingdom', 'GB', 'Europe', 'A demonstration set of malt-led ales, porters, and balanced session styles.'),
  ('Czechia', 'czechia', 'CZ', 'Europe', 'A lager-focused demonstration set with rounded bitterness and expressive pale malt.'),
  ('Ireland', 'ireland', 'IE', 'Europe', 'A compact demonstration set built around dry stout and malt clarity.'),
  ('Denmark', 'denmark', 'DK', 'Europe', 'A modern demonstration set spanning bright hoppy ales and structured dark beer.'),
  ('Japan', 'japan', 'JP', 'Asia Pacific', 'A demonstration set favoring clean fermentation, delicate aroma, and exact finish.'),
  ('Australia', 'australia', 'AU', 'Asia Pacific', 'A demonstration set featuring vivid hop character and refreshing fermentation profiles.'),
  ('Canada', 'canada', 'CA', 'North America', 'A varied demonstration set balancing classic lager structure and modern ale expression.'),
  ('Netherlands', 'netherlands', 'NL', 'Europe', 'A demonstration set connecting historic strong ales with modern brewing practice.'),
  ('France', 'france', 'FR', 'Europe', 'A farmhouse-led demonstration set with dry finishes and culinary aromatics.'),
  ('New Zealand', 'new-zealand', 'NZ', 'Asia Pacific', 'A hop-forward demonstration set with bright tropical and white-fruit aromatics.'),
  ('Mexico', 'mexico', 'MX', 'Latin America', 'A crisp demonstration set with bright lager profiles and restrained bitterness.'),
  ('Brazil', 'brazil', 'BR', 'Latin America', 'A demonstration set exploring vivid fruit, roast, and warm-climate refreshment.');

insert into public.styles (
  name, slug, family, summary, typical_abv_min, typical_abv_max,
  typical_ibu_min, typical_ibu_max, sensory_profile, related_style_slugs
) values
  ('Belgian Quadrupel', 'belgian-quadrupel', 'Strong ale', 'A dark, strong ale with layered dried-fruit, caramel, and fermentation-derived spice.', 9.0, 14.0, 20, 35, '{"aroma":9,"bitterness":3,"sweetness":7,"body":8,"brightness":3,"finish":7}', array['belgian-tripel','brown-ale']),
  ('Imperial IPA', 'imperial-ipa', 'Hop-forward ale', 'A strong pale ale built around saturated hop aroma, firm bitterness, and a dry finish.', 7.5, 10.5, 60, 100, '{"aroma":9,"bitterness":9,"sweetness":3,"body":6,"brightness":8,"finish":8}', array['american-pale-ale']),
  ('Fruit Lambic', 'fruit-lambic', 'Wild and sour', 'A spontaneously fermented, fruit-conditioned beer balancing acidity, orchard character, and earthy depth.', 5.0, 8.0, 0, 15, '{"aroma":8,"bitterness":1,"sweetness":4,"body":4,"brightness":10,"finish":8}', array['saison']),
  ('Imperial Stout', 'imperial-stout', 'Dark ale', 'A dense dark ale with roast, cocoa, dark-fruit, and warming alcohol structure.', 8.0, 14.0, 45, 90, '{"aroma":8,"bitterness":7,"sweetness":7,"body":10,"brightness":2,"finish":9}', array['porter','brown-ale']),
  ('Czech Pilsner', 'czech-pilsner', 'Lager', 'A pale lager with rounded malt, herbal hop character, and firm but integrated bitterness.', 4.2, 5.8, 30, 45, '{"aroma":6,"bitterness":7,"sweetness":3,"body":4,"brightness":9,"finish":8}', array['helles-lager']),
  ('Saison', 'saison', 'Farmhouse ale', 'A dry, highly attenuated farmhouse ale with peppery fermentation and citrus lift.', 5.0, 8.5, 20, 38, '{"aroma":8,"bitterness":5,"sweetness":2,"body":4,"brightness":9,"finish":9}', array['fruit-lambic','belgian-tripel']),
  ('Hefeweizen', 'hefeweizen', 'Wheat beer', 'A cloudy wheat ale with banana-like esters, clove-like spice, and soft bitterness.', 4.3, 5.8, 8, 20, '{"aroma":8,"bitterness":2,"sweetness":4,"body":5,"brightness":7,"finish":6}', array['helles-lager']),
  ('Porter', 'porter', 'Dark ale', 'A dark ale balancing toast, cocoa, moderate roast, and a smoother body than stout.', 4.5, 7.0, 20, 40, '{"aroma":7,"bitterness":5,"sweetness":5,"body":7,"brightness":3,"finish":7}', array['imperial-stout','brown-ale']),
  ('American Pale Ale', 'american-pale-ale', 'Hop-forward ale', 'A medium-strength pale ale with expressive hops, supportive malt, and an easy finish.', 4.5, 6.5, 30, 55, '{"aroma":8,"bitterness":7,"sweetness":3,"body":5,"brightness":8,"finish":8}', array['imperial-ipa']),
  ('Helles Lager', 'helles-lager', 'Lager', 'A pale malt-led lager with gentle bitterness, clean fermentation, and a soft finish.', 4.5, 5.8, 16, 25, '{"aroma":5,"bitterness":3,"sweetness":4,"body":4,"brightness":8,"finish":7}', array['czech-pilsner','hefeweizen']),
  ('Belgian Tripel', 'belgian-tripel', 'Strong ale', 'A strong golden ale with lively carbonation, fruit, spice, and a deceptively dry finish.', 7.5, 10.5, 20, 40, '{"aroma":9,"bitterness":4,"sweetness":5,"body":6,"brightness":8,"finish":9}', array['belgian-quadrupel','saison']),
  ('Brown Ale', 'brown-ale', 'Malt-forward ale', 'A rounded ale with caramel, nut, toast, and low-to-moderate bitterness.', 4.0, 6.5, 15, 30, '{"aroma":6,"bitterness":3,"sweetness":6,"body":6,"brightness":3,"finish":6}', array['porter','belgian-quadrupel']);

create temp table seed_beers (
  seed_rank integer,
  name text,
  slug text,
  brewery_name text,
  brewery_slug text,
  country_slug text,
  style_slug text,
  abv numeric(4,1),
  ibu integer
) on commit drop;

insert into seed_beers values
  (1, 'Lantern Quadrupel', 'lantern-quadrupel', 'North Bell Abbey Works', 'north-bell-abbey-works', 'belgium', 'belgian-quadrupel', 10.4, 28),
  (2, 'Juniper Crown', 'juniper-crown', 'Cascade Almanac', 'cascade-almanac', 'united-states', 'imperial-ipa', 8.7, 82),
  (3, 'Orchard Signal', 'orchard-signal', 'Brasserie Clairière', 'brasserie-clairiere', 'belgium', 'fruit-lambic', 6.2, 8),
  (4, 'Night Atlas', 'night-atlas', 'Harbor Anvil Brewing', 'harbor-anvil-brewing', 'united-states', 'imperial-stout', 11.2, 68),
  (5, 'Tideglass Pilsner', 'tideglass-pilsner', 'Měsíční Pivovar', 'mesicni-pivovar', 'czechia', 'czech-pilsner', 5.0, 38),
  (6, 'Ember Choir', 'ember-choir', 'Ferme des Échos', 'ferme-des-echos', 'france', 'saison', 6.8, 29),
  (7, 'Cloudbreak Wheat', 'cloudbreak-wheat', 'Hochufer Brauerei', 'hochufer-brauerei', 'germany', 'hefeweizen', 5.4, 14),
  (8, 'Meridian Porter', 'meridian-porter', 'Thames Meridian', 'thames-meridian', 'united-kingdom', 'porter', 6.1, 32),
  (9, 'Southern Static', 'southern-static', 'Kea Coast Ales', 'kea-coast-ales', 'new-zealand', 'american-pale-ale', 5.8, 46),
  (10, 'Alpine Current', 'alpine-current', 'Hochufer Brauerei', 'hochufer-brauerei', 'germany', 'helles-lager', 5.1, 20),
  (11, 'Saffron Current', 'saffron-current', 'North Bell Abbey Works', 'north-bell-abbey-works', 'belgium', 'belgian-tripel', 9.1, 31),
  (12, 'Velvet Compass', 'velvet-compass', 'Harbor Anvil Brewing', 'harbor-anvil-brewing', 'united-states', 'brown-ale', 5.9, 26),
  (13, 'Rainline Pale', 'rainline-pale', 'Tasman Assembly', 'tasman-assembly', 'australia', 'american-pale-ale', 5.6, 44),
  (14, 'Black Fig Dubbel', 'black-fig-dubbel', 'Canal House Ferments', 'canal-house-ferments', 'netherlands', 'belgian-quadrupel', 9.6, 25),
  (15, 'Paper Kite Lager', 'paper-kite-lager', 'Shiro Lantern Brewing', 'shiro-lantern-brewing', 'japan', 'helles-lager', 4.8, 18),
  (16, 'Fir & Stone', 'fir-and-stone', 'Northern Survey', 'northern-survey', 'canada', 'porter', 6.4, 35),
  (17, 'Cinder Orchard', 'cinder-orchard', 'Brasserie Clairière', 'brasserie-clairiere', 'belgium', 'fruit-lambic', 6.0, 7),
  (18, 'Salt Meadow', 'salt-meadow', 'Jutland Fieldworks', 'jutland-fieldworks', 'denmark', 'saison', 6.5, 27),
  (19, 'Copper Monsoon', 'copper-monsoon', 'Tasman Assembly', 'tasman-assembly', 'australia', 'brown-ale', 5.7, 24),
  (20, 'Old Quay Stout', 'old-quay-stout', 'Liffey Ledger', 'liffey-ledger', 'ireland', 'imperial-stout', 9.8, 61),
  (21, 'White Pine Signal', 'white-pine-signal', 'Northern Survey', 'northern-survey', 'canada', 'imperial-ipa', 8.4, 79),
  (22, 'Golden Mile', 'golden-mile', 'Měsíční Pivovar', 'mesicni-pivovar', 'czechia', 'czech-pilsner', 4.9, 36),
  (23, 'Pepper Field', 'pepper-field', 'Ferme des Échos', 'ferme-des-echos', 'france', 'saison', 7.1, 30),
  (24, 'Rain Temple', 'rain-temple', 'Shiro Lantern Brewing', 'shiro-lantern-brewing', 'japan', 'hefeweizen', 5.2, 13),
  (25, 'Distant Buoy', 'distant-buoy', 'Kea Coast Ales', 'kea-coast-ales', 'new-zealand', 'imperial-ipa', 8.9, 86),
  (26, 'Amber Archive', 'amber-archive', 'Canal House Ferments', 'canal-house-ferments', 'netherlands', 'belgian-tripel', 8.8, 29),
  (27, 'Limestone Table', 'limestone-table', 'Thames Meridian', 'thames-meridian', 'united-kingdom', 'brown-ale', 5.3, 22),
  (28, 'Cacao Relay', 'cacao-relay', 'Serra Clara', 'serra-clara', 'brazil', 'imperial-stout', 10.6, 64),
  (29, 'Pacific Index', 'pacific-index', 'Cascade Almanac', 'cascade-almanac', 'united-states', 'american-pale-ale', 5.9, 48),
  (30, 'Quiet Bell', 'quiet-bell', 'Hochufer Brauerei', 'hochufer-brauerei', 'germany', 'helles-lager', 5.0, 19),
  (31, 'Apricot Static', 'apricot-static', 'Brasserie Clairière', 'brasserie-clairiere', 'belgium', 'fruit-lambic', 5.8, 6),
  (32, 'Grey Harbor', 'grey-harbor', 'Jutland Fieldworks', 'jutland-fieldworks', 'denmark', 'porter', 6.2, 33),
  (33, 'Citrus Meridian', 'citrus-meridian', 'Kea Coast Ales', 'kea-coast-ales', 'new-zealand', 'american-pale-ale', 5.7, 45),
  (34, 'Abbey Meteor', 'abbey-meteor', 'North Bell Abbey Works', 'north-bell-abbey-works', 'belgium', 'belgian-tripel', 9.3, 32),
  (35, 'Malt Observatory', 'malt-observatory', 'Northern Survey', 'northern-survey', 'canada', 'brown-ale', 5.6, 25),
  (36, 'Porchlight Wheat', 'porchlight-wheat', 'Tasman Assembly', 'tasman-assembly', 'australia', 'hefeweizen', 5.1, 12),
  (37, 'Midnight Cartography', 'midnight-cartography', 'Harbor Anvil Brewing', 'harbor-anvil-brewing', 'united-states', 'imperial-stout', 10.9, 70),
  (38, 'Garden Province', 'garden-province', 'Ferme des Échos', 'ferme-des-echos', 'france', 'saison', 6.7, 28),
  (39, 'Blue Hour Pils', 'blue-hour-pils', 'Měsíční Pivovar', 'mesicni-pivovar', 'czechia', 'czech-pilsner', 5.2, 39),
  (40, 'Cedar Broadcast', 'cedar-broadcast', 'Cascade Almanac', 'cascade-almanac', 'united-states', 'imperial-ipa', 8.2, 76),
  (41, 'Sun Dial Lager', 'sun-dial-lager', 'Casa Horizonte', 'casa-horizonte', 'mexico', 'helles-lager', 4.7, 17),
  (42, 'Roasted Latitude', 'roasted-latitude', 'Serra Clara', 'serra-clara', 'brazil', 'porter', 6.0, 31),
  (43, 'Estuary Pale', 'estuary-pale', 'Thames Meridian', 'thames-meridian', 'united-kingdom', 'american-pale-ale', 5.5, 42),
  (44, 'Pearl Orchard', 'pearl-orchard', 'Canal House Ferments', 'canal-house-ferments', 'netherlands', 'fruit-lambic', 6.1, 9),
  (45, 'Winter Chapel', 'winter-chapel', 'Liffey Ledger', 'liffey-ledger', 'ireland', 'imperial-stout', 9.5, 58),
  (46, 'Field Note Tripel', 'field-note-tripel', 'Jutland Fieldworks', 'jutland-fieldworks', 'denmark', 'belgian-tripel', 8.7, 30),
  (47, 'Soft Current', 'soft-current', 'Shiro Lantern Brewing', 'shiro-lantern-brewing', 'japan', 'helles-lager', 4.9, 18),
  (48, 'Riverglass Wheat', 'riverglass-wheat', 'Hochufer Brauerei', 'hochufer-brauerei', 'germany', 'hefeweizen', 5.3, 15),
  (49, 'Coral Line Pale', 'coral-line-pale', 'Serra Clara', 'serra-clara', 'brazil', 'american-pale-ale', 5.8, 43),
  (50, 'Desert Crescent', 'desert-crescent', 'Casa Horizonte', 'casa-horizonte', 'mexico', 'czech-pilsner', 5.0, 34);

insert into public.breweries (country_id, name, slug)
select distinct c.id, sb.brewery_name, sb.brewery_slug
from seed_beers sb
join public.countries c on c.slug = sb.country_slug;

insert into public.beers (
  release_id, brewery_id, country_id, style_id, name, slug, description,
  abv, ibu, calories, original_gravity, final_gravity, color_srm
)
select
  r.id,
  br.id,
  c.id,
  s.id,
  sb.name,
  sb.slug,
  'A fictional demonstration entry designed to illustrate the ' || lower(s.name) || ' profile within BeerBoard.',
  sb.abv,
  case when sb.seed_rank in (17, 31, 44) then null else sb.ibu end,
  case when sb.seed_rank % 9 = 0 then null else round(92 + sb.abv * 14)::integer end,
  case when sb.seed_rank % 11 = 0 then null else round((1.036 + sb.abv / 180)::numeric, 3) end,
  case when sb.seed_rank % 11 = 0 then null else round((1.006 + (sb.seed_rank % 5) * 0.001)::numeric, 3) end,
  case s.family
    when 'Dark ale' then 32 + (sb.seed_rank % 8)
    when 'Malt-forward ale' then 18 + (sb.seed_rank % 6)
    when 'Strong ale' then 7 + (sb.seed_rank % 8)
    else 3 + (sb.seed_rank % 6)
  end
from seed_beers sb
join public.dataset_releases r on r.slug = 'global-demo-2026-07'
join public.breweries br on br.slug = sb.brewery_slug
join public.countries c on c.slug = sb.country_slug
join public.styles s on s.slug = sb.style_slug;

insert into public.beer_assessments (
  beer_id, quality, balance, distinctiveness, technical_execution,
  aroma, bitterness, sweetness, body, brightness, finish,
  editorial_verdict, methodology_note, assessed_at
)
select
  b.id,
  round((100 - sb.seed_rank * 0.28)::numeric, 2),
  round((99.5 - sb.seed_rank * 0.30 + (sb.seed_rank % 3) * 0.25)::numeric, 2),
  round((100 - sb.seed_rank * 0.34 + (sb.seed_rank % 4) * 0.20)::numeric, 2),
  round((99.2 - sb.seed_rank * 0.27 + (sb.seed_rank % 5) * 0.12)::numeric, 2),
  greatest(1, least(10, 5.5 + (sb.seed_rank % 5) * 0.8)),
  greatest(1, least(10, coalesce(sb.ibu, 20) / 11.0)),
  greatest(1, least(10, 3.0 + (sb.seed_rank % 6) * 0.7)),
  greatest(1, least(10, 4.0 + sb.abv / 2.0)),
  greatest(1, least(10, 9.5 - (sb.seed_rank % 7) * 0.7)),
  greatest(1, least(10, 6.0 + (sb.seed_rank % 5) * 0.7)),
  sb.name || ' is a fictional demonstration beer. Its profile emphasizes the expected structure of ' || s.name || ' while showing clear tradeoffs between intensity, balance, and finish.',
  'Index score is generated in PostgreSQL from quality (35%), balance (25%), distinctiveness (20%), and technical execution (20%).',
  '2026-07-14T00:00:00Z'
from seed_beers sb
join public.beers b on b.slug = sb.slug
join public.styles s on s.slug = sb.style_slug;

insert into public.descriptors (name, category) values
  ('Citrus peel', 'fruit'), ('Orchard fruit', 'fruit'), ('Dark fruit', 'fruit'),
  ('Tropical fruit', 'fruit'), ('Cocoa', 'roast'), ('Coffee', 'roast'),
  ('Toast', 'malt'), ('Caramel', 'malt'), ('Herbal hop', 'hop'),
  ('Pine', 'hop'), ('Pepper', 'spice'), ('Clove', 'spice'),
  ('Banana', 'fermentation'), ('Wild earth', 'fermentation'), ('Mineral', 'structure');

insert into public.beer_descriptors (beer_id, descriptor_id, intensity)
select b.id, d.id,
  case d.name
    when 'Citrus peel' then 7.8
    when 'Cocoa' then 8.2
    when 'Pepper' then 7.6
    else 7.0
  end
from public.beers b
join public.styles s on s.id = b.style_id
join public.descriptors d on d.name = case
  when s.slug in ('imperial-ipa', 'american-pale-ale') then 'Citrus peel'
  when s.slug in ('imperial-stout', 'porter') then 'Cocoa'
  when s.slug in ('saison', 'belgian-tripel') then 'Pepper'
  when s.slug = 'hefeweizen' then 'Banana'
  when s.slug = 'fruit-lambic' then 'Orchard fruit'
  when s.slug in ('czech-pilsner', 'helles-lager') then 'Herbal hop'
  when s.slug = 'belgian-quadrupel' then 'Dark fruit'
  else 'Caramel'
end;

insert into public.beer_descriptors (beer_id, descriptor_id, intensity)
select b.id, d.id, 6.2 + (b.id % 4) * 0.5
from public.beers b
join public.styles s on s.id = b.style_id
join public.descriptors d on d.name = case
  when s.family = 'Hop-forward ale' then 'Pine'
  when s.family = 'Dark ale' then 'Coffee'
  when s.family = 'Strong ale' then 'Caramel'
  when s.family = 'Wild and sour' then 'Wild earth'
  when s.family = 'Wheat beer' then 'Clove'
  when s.family = 'Lager' then 'Mineral'
  else 'Toast'
end;

commit;
