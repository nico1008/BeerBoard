import type { Metadata } from "next";
import Link from "next/link";
import { DatasetNotice } from "@/components/dataset-notice";
import { getCatalogStats, getLatestRelease, listCountries } from "@/lib/catalog";

export const metadata: Metadata = { title: "Countries" };
export const revalidate = 3600;

export default async function CountriesPage() {
  const [countries, stats, release] = await Promise.all([listCountries(), getCatalogStats(), getLatestRelease()]);
  return (
    <div className="container page">
      <header className="page-header">
        <div><h1>Global output</h1><p>See how the demonstration catalog is distributed across countries, breweries, and leading regional entries.</p></div>
      </header>
      <DatasetNotice release={release} />
      <dl className="metrics section" aria-label="Catalog-wide statistics">
        <div className="metric"><dt>Indexed beers</dt><dd>{stats.beerCount}</dd></div>
        <div className="metric"><dt>Global mean</dt><dd>{stats.meanScore.toFixed(1)}</dd></div>
        <div className="metric"><dt>Active countries</dt><dd>{stats.countryCount}</dd></div>
        <div className="metric"><dt>Breweries</dt><dd>{stats.breweryCount}</dd></div>
      </dl>
      <section className="section" aria-labelledby="country-catalog-heading">
        <div className="section-heading"><div><h2 id="country-catalog-heading">Country catalog</h2><p>Scores and counts are derived from the current database release.</p></div></div>
        <div className="catalog-list">
          {countries.filter((country) => country.beer_count > 0).map((country) => (
            <article className="catalog-row" key={country.id}>
              <div><h3><Link href={`/countries/${country.slug}`}>{country.name}</Link></h3><p>{country.region} · {country.iso_code}</p></div>
              <div><span className="table-label">Average index</span><div className="catalog-value">{country.average_score?.toFixed(1) ?? "Not reported"}</div></div>
              <div><span className="table-label">Coverage</span><div className="catalog-value">{country.beer_count} beers · {country.brewery_count} breweries</div></div>
              <div><span className="table-label">Leading beer</span><div>{country.leading_beer_slug ? <Link href={`/beers/${country.leading_beer_slug}`}>{country.leading_beer_name}</Link> : "Not reported"}</div></div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
