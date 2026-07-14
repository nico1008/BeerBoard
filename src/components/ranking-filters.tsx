import Link from "next/link";
import type { CountrySummaryRow, StyleSummaryRow } from "@/lib/supabase/database.types";
import type { RankingFilters } from "@/lib/ranking";

export function RankingFilterForm({
  filters,
  countries,
  styles,
}: {
  filters: RankingFilters;
  countries: CountrySummaryRow[];
  styles: StyleSummaryRow[];
}) {
  return (
    <form className="filters" action="/beers" method="get">
      <div className="filter-field">
        <label className="filter-label" htmlFor="q">Search catalog</label>
        <input className="input" id="q" name="q" type="search" defaultValue={filters.q} placeholder="Beer, brewery, country, or style" />
      </div>
      <div className="filter-field">
        <label className="filter-label" htmlFor="country">Country</label>
        <select className="select" id="country" name="country" defaultValue={filters.country}>
          <option value="">All countries</option>
          {countries.filter((country) => country.beer_count > 0).map((country) => (
            <option value={country.slug} key={country.id}>{country.name}</option>
          ))}
        </select>
      </div>
      <div className="filter-field">
        <label className="filter-label" htmlFor="style">Style</label>
        <select className="select" id="style" name="style" defaultValue={filters.style}>
          <option value="">All styles</option>
          {styles.filter((style) => style.beer_count > 0).map((style) => (
            <option value={style.slug} key={style.id}>{style.name}</option>
          ))}
        </select>
      </div>
      <div className="filter-field">
        <label className="filter-label" htmlFor="minScore">Minimum score</label>
        <input className="input" id="minScore" name="minScore" type="number" min="0" max="100" step="0.1" defaultValue={filters.minScore || ""} placeholder="Any score" inputMode="decimal" />
      </div>
      <div className="filter-field">
        <label className="filter-label" htmlFor="sort">Sort by</label>
        <select className="select" id="sort" name="sort" defaultValue={filters.sort}>
          <option value="rank">Global rank</option>
          <option value="score">Index score</option>
          <option value="name">Beer name</option>
          <option value="abv">ABV</option>
          <option value="country">Country</option>
          <option value="style">Style</option>
        </select>
      </div>
      <div className="filter-field">
        <label className="filter-label" htmlFor="direction">Direction</label>
        <select className="select" id="direction" name="direction" defaultValue={filters.direction}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div className="filter-actions">
        <Link className="button-ghost" href="/beers">Clear filters</Link>
        <button className="button-secondary" type="submit">Apply filters</button>
      </div>
    </form>
  );
}
