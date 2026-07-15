import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
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
  const hasAdvancedFilters = Boolean(filters.country || filters.style || filters.minScore || filters.sort !== "rank" || filters.direction !== "asc");

  return (
    <form className="ranking-tools" action="/beers" method="get">
      <div className="ranking-search">
        <Search aria-hidden="true" size={20} />
        <label className="sr-only" htmlFor="q">Search beers</label>
        <input id="q" name="q" type="search" defaultValue={filters.q} placeholder="Search a beer, brewery, place, or style" />
        <button className="button-secondary" type="submit">Search</button>
      </div>
      <details className="filter-drawer" open={hasAdvancedFilters}>
        <summary><SlidersHorizontal aria-hidden="true" size={18} /><span>Refine the list</span>{hasAdvancedFilters ? <span className="filter-status">Filters active</span> : null}</summary>
        <div className="filters">
          <div className="filter-field">
            <label className="filter-label" htmlFor="country">Country</label>
            <select className="select" id="country" name="country" defaultValue={filters.country}>
              <option value="">Anywhere</option>
              {countries.filter((country) => country.beer_count > 0).map((country) => <option value={country.slug} key={country.id}>{country.name}</option>)}
            </select>
          </div>
          <div className="filter-field">
            <label className="filter-label" htmlFor="style">Style</label>
            <select className="select" id="style" name="style" defaultValue={filters.style}>
              <option value="">Any style</option>
              {styles.filter((style) => style.beer_count > 0).map((style) => <option value={style.slug} key={style.id}>{style.name}</option>)}
            </select>
          </div>
          <div className="filter-field">
            <label className="filter-label" htmlFor="minScore">Minimum score</label>
            <input className="input" id="minScore" name="minScore" type="number" min="0" max="100" step="0.1" defaultValue={filters.minScore || ""} placeholder="Any score" inputMode="decimal" />
          </div>
          <div className="filter-field">
            <label className="filter-label" htmlFor="sort">Sort by</label>
            <select className="select" id="sort" name="sort" defaultValue={filters.sort}>
              <option value="rank">Global rank</option><option value="score">Score</option><option value="name">Beer name</option><option value="abv">Strength</option><option value="country">Country</option><option value="style">Style</option>
            </select>
          </div>
          <div className="filter-field">
            <label className="filter-label" htmlFor="direction">Direction</label>
            <select className="select" id="direction" name="direction" defaultValue={filters.direction}>
              <option value="asc">Ascending</option><option value="desc">Descending</option>
            </select>
          </div>
          <div className="filter-actions">
            <Link className="button-ghost" href="/beers"><RotateCcw aria-hidden="true" size={17} />Reset</Link>
            <button className="button-secondary" type="submit">Apply filters</button>
          </div>
        </div>
      </details>
    </form>
  );
}
