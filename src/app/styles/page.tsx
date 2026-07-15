import type { Metadata } from "next";
import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { StyleDiscoveryIntro } from "@/components/style-discovery-intro";
import { listStyles } from "@/lib/catalog";
import stylesModule from "./styles.module.css";

export const metadata: Metadata = { title: "Beer styles" };
export const revalidate = 3600;

export default async function StylesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = (rawQuery ?? "").trim().toLocaleLowerCase().slice(0, 80);
  const styles = await listStyles();
  const filtered = styles.filter((style) => !query || style.name.toLocaleLowerCase().includes(query) || style.family.toLocaleLowerCase().includes(query));
  const families = Map.groupBy(filtered, (style) => style.family);
  const featuredFamilies = [...Map.groupBy(styles.filter((style) => style.beer_count > 0), (style) => style.family).entries()].slice(0, 5).map(([name, familyStyles]) => ({ name, sampleStyles: familyStyles.slice(0, 2).map((style) => style.name) }));

  return (
    <div className={`page styles-page ${stylesModule.page}`}>
      <StyleDiscoveryIntro families={query ? [] : featuredFamilies} />

      <div className={`container ${stylesModule.directory}`}>
        <form className="style-search" action="/styles" method="get"><Search aria-hidden="true" size={20} /><label className="sr-only" htmlFor="style-search">Search styles or families</label><input id="style-search" name="q" type="search" defaultValue={rawQuery ?? ""} placeholder="Search lager, stout, sour, wheat…" /><button className="button-secondary" type="submit">Search</button></form>

        {filtered.length ? [...families.entries()].map(([family, familyStyles]) => (
          <section className="style-family" aria-labelledby={`family-${slugify(family)}`} key={family}>
            <header><h2 id={`family-${slugify(family)}`}>{family}</h2><p>{familyStyles.length} {familyStyles.length === 1 ? "style" : "styles"} in this release</p></header>
            <div className="style-list">{familyStyles.map((style) => <article className="style-entry" key={style.id}><div><h3><Link href={`/styles/${style.slug}`}>{style.name}</Link></h3><p>{style.summary}</p></div><dl><div><dt>Typical strength</dt><dd>{formatRange(style.typical_abv_min, style.typical_abv_max, "%")}</dd></div><div><dt>Typical bitterness</dt><dd>{formatRange(style.typical_ibu_min, style.typical_ibu_max, " IBU")}</dd></div></dl><div className="style-leading"><span>Beer to explore</span>{style.leading_beer_slug ? <Link href={`/beers/${style.leading_beer_slug}`}>{style.leading_beer_name}</Link> : <span>Not reported</span>}</div><Link className="entry-arrow" href={`/styles/${style.slug}`} aria-label={`Explore ${style.name}`}><ArrowRight aria-hidden="true" /></Link></article>)}</div>
          </section>
        )) : <div className="empty-state"><h2>No styles match “{rawQuery}”</h2><p>Try a broader style or family name, or clear the query to see the full catalog.</p><Link className="button-ghost" href="/styles">Clear search</Link></div>}
      </div>
    </div>
  );
}

function formatRange(min: number | null, max: number | null, suffix = "") { return min === null || max === null ? "Not reported" : `${min}–${max}${suffix}`; }
function slugify(value: string) { return value.toLocaleLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/(^-|-$)/g, ""); }
