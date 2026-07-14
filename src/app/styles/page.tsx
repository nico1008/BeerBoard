import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { listStyles } from "@/lib/catalog";

export const metadata: Metadata = { title: "Styles" };
export const revalidate = 3600;

export default async function StylesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = (rawQuery ?? "").trim().toLocaleLowerCase().slice(0, 80);
  const styles = await listStyles();
  const filtered = styles.filter((style) => !query || style.name.toLocaleLowerCase().includes(query) || style.family.toLocaleLowerCase().includes(query));
  const families = Map.groupBy(filtered, (style) => style.family);

  return (
    <div className="container page">
      <header className="page-header"><div><h1>Beer styles</h1><p>Explore style families, expected ranges, sensory profiles, and indexed demonstration examples.</p></div></header>
      <form className="filters" action="/styles" method="get" style={{ gridTemplateColumns: "1fr auto" }}>
        <div className="filter-field"><label className="filter-label" htmlFor="style-search">Search styles or families</label><input className="input" id="style-search" name="q" type="search" defaultValue={rawQuery ?? ""} placeholder="Try “lager” or “dark ale”" /></div>
        <button className="button-secondary" type="submit" style={{ alignSelf: "end" }}><Search size={17} />Search</button>
      </form>
      {filtered.length ? [...families.entries()].map(([family, familyStyles]) => (
        <section className="section" aria-labelledby={`family-${family.replaceAll(" ", "-")}`} key={family}>
          <div className="section-heading"><h2 id={`family-${family.replaceAll(" ", "-")}`}>{family}</h2><p>{familyStyles.length} {familyStyles.length === 1 ? "style" : "styles"}</p></div>
          <div className="catalog-list">
            {familyStyles.map((style) => (
              <article className="catalog-row" key={style.id}>
                <div><h3><Link href={`/styles/${style.slug}`}>{style.name}</Link></h3><p>{style.summary}</p></div>
                <div><span className="table-label">Typical ABV</span><div className="catalog-value">{formatRange(style.typical_abv_min, style.typical_abv_max, "%")}</div></div>
                <div><span className="table-label">Typical IBU</span><div className="catalog-value">{formatRange(style.typical_ibu_min, style.typical_ibu_max)}</div></div>
                <div><span className="table-label">Highest ranked</span><div>{style.leading_beer_slug ? <Link href={`/beers/${style.leading_beer_slug}`}>{style.leading_beer_name}</Link> : "Not reported"}</div></div>
              </article>
            ))}
          </div>
        </section>
      )) : <div className="empty-state"><h2>No styles match “{rawQuery}”</h2><p>Search by a broader style or family name, or clear the query to see the full catalog.</p><Link className="button-ghost" href="/styles">Clear search</Link></div>}
    </div>
  );
}

function formatRange(min: number | null, max: number | null, suffix = "") {
  if (min === null || max === null) return "Not reported";
  return `${min}${suffix}–${max}${suffix}`;
}
