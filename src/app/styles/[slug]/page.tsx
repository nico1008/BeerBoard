import { Shapes } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BeerRankingTable } from "@/components/beer-ranking-table";
import { Measurement } from "@/components/measurement";
import { SensoryProfile, type SensoryValues } from "@/components/sensory-profile";
import { getStyle, listStyleBeers, listStyles } from "@/lib/catalog";

export const revalidate = 3600;

export default async function StyleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [style, beers, allStyles] = await Promise.all([getStyle(slug), listStyleBeers(slug), listStyles()]);
  if (!style) notFound();
  const raw = typeof style.sensory_profile === "object" && style.sensory_profile !== null && !Array.isArray(style.sensory_profile) ? style.sensory_profile : {};
  const sensory: SensoryValues = { Aroma: numeric(raw.aroma), Bitterness: numeric(raw.bitterness), Sweetness: numeric(raw.sweetness), Body: numeric(raw.body), Brightness: numeric(raw.brightness), Finish: numeric(raw.finish) };
  const related = allStyles.filter((candidate) => style.related_style_slugs.includes(candidate.slug));

  return (
    <div className="container page style-profile-page">
      <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/styles">Styles</Link><span>/</span><span aria-current="page">{style.name}</span></nav>
      <header className="style-profile-hero"><div><Shapes aria-hidden="true" /><p>{style.family}</p><h1>{style.name}</h1><span>{style.summary}</span></div><div className="place-score"><span>Catalog average</span><strong>{style.average_score?.toFixed(1) ?? "—"}</strong><small>Across {style.beer_count} indexed {style.beer_count === 1 ? "beer" : "beers"}</small></div></header>
      <section className="style-range" aria-labelledby="range-heading"><div className="profile-section-title"><h2 id="range-heading">Typical range</h2><p>A practical outline, not a rigid recipe.</p></div><dl className="measurements measurement-strip"><Measurement label="Alcohol" value={range(style.typical_abv_min, style.typical_abv_max, "%")} /><Measurement label="Bitterness" value={range(style.typical_ibu_min, style.typical_ibu_max, " IBU")} /><Measurement label="Indexed examples" value={style.beer_count} /></dl></section>
      <section className="style-sensory" aria-labelledby="style-sensory"><div className="profile-section-title"><h2 id="style-sensory">How this style usually drinks</h2><p>Expected style values, shown as a chart and exact numeric list.</p></div><SensoryProfile values={sensory} title={`${style.name} typical sensory profile`} /></section>
      {related.length ? <nav className="related-styles" aria-label="Related beer styles"><span>Related styles</span>{related.map((item) => <Link href={`/styles/${item.slug}`} key={item.id}>{item.name}</Link>)}</nav> : null}
      <section className="section" aria-labelledby="style-examples"><div className="section-heading"><div><h2 id="style-examples">Beers to explore</h2><p>Demonstration examples ordered by their current BeerBoard score.</p></div></div>{beers.length ? <BeerRankingTable beers={beers} /> : <div className="empty-state"><h2>No examples in this release</h2><p>The style guide remains available even when no demonstration beers are indexed.</p></div>}</section>
    </div>
  );
}

function numeric(value: unknown) { return typeof value === "number" ? value : 0; }
function range(min: number | null, max: number | null, suffix: string) { return min === null || max === null ? null : `${min}–${max}${suffix}`; }
