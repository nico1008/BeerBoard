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
  beers.forEach((beer) => {
    const current = styleCounts.get(beer.style_slug);
    styleCounts.set(beer.style_slug, { name: beer.style_name, slug: beer.style_slug, count: (current?.count ?? 0) + 1 });
  });
  const distribution = [...styleCounts.values()].sort((a, b) => b.count - a.count);

  return (
    <div className="container page">
      <header className="page-header">
        <div><div className="chip-list"><span className="chip">{country.region}</span><span className="chip">{country.iso_code}</span></div><h1 style={{ marginTop: "1rem" }}>{country.name}</h1><p>{country.summary}</p></div>
        <dl className="audit-meta"><dt>Average index</dt><dd>{country.average_score?.toFixed(1) ?? "Not reported"}</dd></dl>
      </header>
      <dl className="metrics section">
        <div className="metric"><dt>Indexed beers</dt><dd>{country.beer_count}</dd></div>
        <div className="metric"><dt>Breweries</dt><dd>{country.brewery_count}</dd></div>
        <div className="metric"><dt>Leading beer</dt><dd style={{ fontSize: "1rem" }}>{country.leading_beer_slug ? <Link href={`/beers/${country.leading_beer_slug}`}>{country.leading_beer_name}</Link> : "Not reported"}</dd></div>
        <div className="metric"><dt>Styles represented</dt><dd>{distribution.length}</dd></div>
      </dl>
      <section className="section" aria-labelledby="country-ranking">
        <div className="section-heading"><div><h2 id="country-ranking">Ranked beers</h2><p>Ordered by BeerBoard Index within the global demonstration release.</p></div></div>
        {beers.length ? <BeerRankingTable beers={beers} /> : <div className="empty-state"><h2>No indexed beers</h2><p>This country has no beers in the current demonstration release.</p></div>}
      </section>
      <section className="section panel" aria-labelledby="style-distribution">
        <h2 id="style-distribution">Style distribution</h2>
        {distribution.length ? (
          <div className="distribution">
            {distribution.map((style) => {
              const percentage = beers.length ? (style.count / beers.length) * 100 : 0;
              return (
                <div className="distribution-row" key={style.slug}>
                  <Link href={`/styles/${style.slug}`}>{style.name}</Link>
                  <div className="meter" aria-hidden="true"><span style={{ width: `${percentage}%` }} /></div>
                  <span>{style.count} · {percentage.toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
        ) : <p>No style distribution is available.</p>}
      </section>
    </div>
  );
}
