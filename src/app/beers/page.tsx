import type { Metadata } from "next";
import Link from "next/link";
import { BeerRankingTable } from "@/components/beer-ranking-table";
import { DatasetNotice } from "@/components/dataset-notice";
import { ExportButton } from "@/components/export-button";
import { Pagination } from "@/components/pagination";
import { RankingFilterForm } from "@/components/ranking-filters";
import { getLatestRelease, listBeers, listCountries, listStyles } from "@/lib/catalog";
import { filtersToSearchParams, parseRankingFilters } from "@/lib/ranking";

export const metadata: Metadata = { title: "Global Top 50" };
export const revalidate = 3600;

export default async function BeersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const filters = parseRankingFilters(await searchParams);
  const [{ beers, count }, countries, styles, release] = await Promise.all([
    listBeers(filters),
    listCountries(),
    listStyles(),
    getLatestRelease(),
  ]);
  const exportParams = filtersToSearchParams(filters, false);

  return (
    <div className="container page">
      <header className="page-header">
        <div>
          <h1>Global Top 50</h1>
          <p>Explore a transparent demonstration ranking, compare profiles, and follow each score back to its measured inputs.</p>
        </div>
        <dl className="audit-meta">
          <dt>Last audited</dt>
          <dd>{release ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(release.audited_at)) : "Unavailable"}</dd>
        </dl>
      </header>
      <DatasetNotice release={release} />
      <RankingFilterForm filters={filters} countries={countries} styles={styles} />
      <div className="ranking-summary">
        <p>{count === 1 ? "1 matching beer" : `${count} matching beers`}</p>
        <ExportButton href={`/api/export/beers?${exportParams}`} />
      </div>
      {beers.length ? (
        <>
          <BeerRankingTable beers={beers} />
          <Pagination count={count} filters={filters} />
        </>
      ) : (
        <div className="empty-state">
          <h2>No beers match these filters</h2>
          <p>Try a broader search, lower the minimum score, or clear all filters to return to the full demonstration ranking.</p>
          <Link className="button-ghost" href="/beers">Clear filters</Link>
        </div>
      )}
    </div>
  );
}
