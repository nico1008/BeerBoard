create index beer_descriptors_descriptor_id_idx
  on public.beer_descriptors(descriptor_id);

create index beers_release_id_idx
  on public.beers(release_id);

create index breweries_country_id_idx
  on public.breweries(country_id);

create index ledger_entries_beer_id_idx
  on public.ledger_entries(beer_id);
