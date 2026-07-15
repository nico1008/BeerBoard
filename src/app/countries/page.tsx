import type { Metadata } from "next";
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { DatasetNotice } from "@/components/dataset-notice";
import { getCatalogStats, getLatestRelease, listCountries } from "@/lib/catalog";

export const metadata: Metadata = { title: "Beer around the world" };
export const revalidate = 3600;

export default async function CountriesPage() {
  const [countries, stats, release] = await Promise.all([listCountries(), getCatalogStats(), getLatestRelease()]);
  const activeCountries = countries.filter((country) => country.beer_count > 0);
  return (
    <div className="container page countries-page">
      <header className="world-hero"><div><MapPin aria-hidden="true" size={24} /><h1>Beer belongs to a place.</h1><p>Travel the current BeerBoard catalog through brewing cultures, local makers, and the beers that carry their character.</p></div><p className="world-stats"><strong>{stats.beerCount}</strong> beers from <strong>{stats.countryCount}</strong> countries and <strong>{stats.breweryCount}</strong> breweries, with a catalog mean of <strong>{stats.meanScore.toFixed(1)}</strong>.</p></header>
      <DatasetNotice release={release} />
      <section className="country-directory" aria-labelledby="country-directory-heading">
        <div className="section-heading"><div><h2 id="country-directory-heading">Choose a country</h2><p>Open a place to see its leading beers, styles, and catalog distribution.</p></div></div>
        <div className="country-list">
          {activeCountries.map((country, index) => <article className="country-entry" key={country.id}><span>{String(index + 1).padStart(2, "0")}</span><div><p>{country.region} · {country.iso_code}</p><h3><Link href={`/countries/${country.slug}`}>{country.name}</Link></h3></div><div className="country-coverage"><p>{country.beer_count} {country.beer_count === 1 ? "beer" : "beers"} · {country.brewery_count} {country.brewery_count === 1 ? "brewery" : "breweries"}</p><strong>{country.average_score?.toFixed(1) ?? "—"} average</strong></div><div className="country-leader"><span>Leading beer</span>{country.leading_beer_slug ? <Link href={`/beers/${country.leading_beer_slug}`}>{country.leading_beer_name}</Link> : <span>Not reported</span>}</div><Link className="entry-arrow" href={`/countries/${country.slug}`} aria-label={`Explore beer from ${country.name}`}><ArrowRight aria-hidden="true" /></Link></article>)}
        </div>
      </section>
    </div>
  );
}
