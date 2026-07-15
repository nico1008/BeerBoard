import type { Metadata } from "next";
import Link from "next/link";
import { BeerRankingTable } from "@/components/beer-ranking-table";
import { ExportButton } from "@/components/export-button";
import { Pagination } from "@/components/pagination";
import { RankingFilterForm } from "@/components/ranking-filters";
import { getLatestRelease, listBeers, listCountries, listStyles } from "@/lib/catalog";
import { filtersToSearchParams, parseRankingFilters } from "@/lib/ranking";

export const metadata: Metadata = { title: "Beer rankings" };
export const revalidate = 3600;

export default async function BeersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const filters = parseRankingFilters(await searchParams);
  const [{ beers, count }, countries, styles, release] = await Promise.all([listBeers(filters), listCountries(), listStyles(), getLatestRelease()]);
  const exportParams = filtersToSearchParams(filters, false);
  const isFiltered = Boolean(filters.q || filters.country || filters.style || filters.minScore || filters.sort !== "rank" || filters.direction !== "asc");

  return (
    <div className="container page ranking-page">
      <header className="ranking-header">
        <div><p>{isFiltered ? "Your filtered selection" : "The current BeerBoard list"}</p><h2>{isFiltered ? "Search results" : "50 beers to know"}</h2><span>Rankings are a starting point, not a verdict. Open any beer to understand its style, character, and score.</span></div>
        <div className="ranking-audit"><span>Release audit</span><strong>{release ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(release.audited_at)) : "Unavailable"}</strong></div>
      </header>
      <RankingFilterForm filters={filters} countries={countries} styles={styles} />
      <div className="ranking-summary">
        <p>{count === 1 ? "1 beer found" : `${count} beers found`}</p>
        <ExportButton href={`/api/export/beers?${exportParams}`} label="Download list" />
      </div>
      {beers.length ? <><BeerRankingTable beers={beers} /><Pagination count={count} filters={filters} /></> : (
        <div className="empty-state"><h2>No beers match that search</h2><p>Try another brewery, broaden the score range, or clear the filters to return to the full list.</p><Link className="button-ghost" href="/beers">Clear filters</Link></div>
      )}
    </div>
  );
}
