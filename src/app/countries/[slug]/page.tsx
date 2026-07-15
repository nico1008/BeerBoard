import { MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BeerRankingTable } from "@/components/beer-ranking-table";
import { getCountry, listCountryBeers } from "@/lib/catalog";

export const revalidate = 3600;

export default async function CountryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [country, beers] = await Promise.all([getCountry(slug), listCountryBeers(slug)]);
  if (!country) notFound();
  const styleCounts = new Map<string, { name: string; slug: string; count: number }>();
  beers.forEach((beer) => { const current = styleCounts.get(beer.style_slug); styleCounts.set(beer.style_slug, { name: beer.style_name, slug: beer.style_slug, count: (current?.count ?? 0) + 1 }); });
  const distribution = [...styleCounts.values()].sort((a, b) => b.count - a.count);

  return (
    <div className="container page country-profile-page">
      <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/countries">Countries</Link><span>/</span><span aria-current="page">{country.name}</span></nav>
      <header className="place-profile-hero"><div><MapPin aria-hidden="true" /><p>{country.region} · {country.iso_code}</p><h1>{country.name}</h1><span>{country.summary}</span></div><div className="place-score"><span>Catalog average</span><strong>{country.average_score?.toFixed(1) ?? "—"}</strong><small>Across {country.beer_count} indexed {country.beer_count === 1 ? "beer" : "beers"}</small></div></header>
      <dl className="place-facts"><div><dt>Breweries</dt><dd>{country.brewery_count}</dd></div><div><dt>Styles represented</dt><dd>{distribution.length}</dd></div><div><dt>Leading beer</dt><dd>{country.leading_beer_slug ? <Link href={`/beers/${country.leading_beer_slug}`}>{country.leading_beer_name}</Link> : "Not reported"}</dd></div></dl>
      <section className="section" aria-labelledby="country-ranking"><div className="section-heading"><div><h2 id="country-ranking">Beers from {country.name}</h2><p>Ordered within the current global demonstration release.</p></div></div>{beers.length ? <BeerRankingTable beers={beers} /> : <div className="empty-state"><h2>No indexed beers</h2><p>This country has no beers in the current demonstration release.</p></div>}</section>
      <section className="section distribution-section" aria-labelledby="style-distribution"><div className="section-heading"><div><h2 id="style-distribution">Styles in this selection</h2><p>A quick view of how the country’s catalog is distributed.</p></div></div>{distribution.length ? <div className="distribution">{distribution.map((style) => { const percentage = beers.length ? (style.count / beers.length) * 100 : 0; return <div className="distribution-row" key={style.slug}><Link href={`/styles/${style.slug}`}>{style.name}</Link><div className="meter" aria-hidden="true"><span style={{ width: `${percentage}%` }} /></div><span>{style.count} · {percentage.toFixed(0)}%</span></div>; })}</div> : <p>No style distribution is available.</p>}</section>
    </div>
  );
}
