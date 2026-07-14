import type { Metadata } from "next";
import { DatasetNotice } from "@/components/dataset-notice";
import { getCatalogStats, getLatestRelease, listStyles } from "@/lib/catalog";

export const metadata: Metadata = { title: "Data counters" };
export const revalidate = 3600;

export default async function DataCountersPage() {
  const [stats, release, styles] = await Promise.all([getCatalogStats(), getLatestRelease(), listStyles()]);
  return <div className="container page"><header className="page-header"><div><h1>Data counters</h1><p>Live aggregates calculated from the current Supabase catalog.</p></div></header><DatasetNotice release={release} /><dl className="metrics section"><div className="metric"><dt>Beers</dt><dd>{stats.beerCount}</dd></div><div className="metric"><dt>Countries</dt><dd>{stats.countryCount}</dd></div><div className="metric"><dt>Breweries</dt><dd>{stats.breweryCount}</dd></div><div className="metric"><dt>Styles</dt><dd>{styles.filter((style) => style.beer_count > 0).length}</dd></div></dl><article className="prose section"><h2>How these counts work</h2><p>Each value is derived from database rows or security-invoker aggregate views. The interface does not keep a second counter file, and it does not estimate missing rows.</p><p>Current global mean: <strong>{stats.meanScore.toFixed(2)}</strong>. Last audited: <strong>{release ? new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" }).format(new Date(release.audited_at)) : "Unavailable"}</strong>.</p></article></div>;
}
