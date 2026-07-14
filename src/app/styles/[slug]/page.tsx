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
  const sensory: SensoryValues = {
    Aroma: numeric(raw.aroma),
    Bitterness: numeric(raw.bitterness),
    Sweetness: numeric(raw.sweetness),
    Body: numeric(raw.body),
    Brightness: numeric(raw.brightness),
    Finish: numeric(raw.finish),
  };
  const related = allStyles.filter((candidate) => style.related_style_slugs.includes(candidate.slug));

  return (
    <div className="container page">
      <header className="page-header">
        <div><span className="chip">{style.family}</span><h1 style={{ marginTop: "1rem" }}>{style.name}</h1><p>{style.summary}</p></div>
        <dl className="audit-meta"><dt>Average index</dt><dd>{style.average_score?.toFixed(1) ?? "Not reported"}</dd></dl>
      </header>
      <section className="section content-grid">
        <div className="panel"><h2>Typical range</h2><dl className="measurements"><Measurement label="Alcohol" value={range(style.typical_abv_min, style.typical_abv_max, "%")} /><Measurement label="Bitterness" value={range(style.typical_ibu_min, style.typical_ibu_max, " IBU")} /><Measurement label="Indexed examples" value={style.beer_count} /></dl></div>
        <div className="panel"><h2>Related styles</h2>{related.length ? <div className="chip-list" style={{ marginTop: "1rem" }}>{related.map((item) => <Link className="chip" href={`/styles/${item.slug}`} key={item.id}>{item.name}</Link>)}</div> : <p>No directly related styles are defined in this demonstration release.</p>}</div>
      </section>
      <section className="section panel" aria-labelledby="style-sensory"><div className="section-heading"><div><h2 id="style-sensory">Typical sensory profile</h2><p>Expected style values, shown as both a chart and exact numeric list.</p></div></div><SensoryProfile values={sensory} title={`${style.name} typical sensory profile`} /></section>
      <section className="section" aria-labelledby="style-examples"><div className="section-heading"><div><h2 id="style-examples">Indexed examples</h2><p>Demonstration beers ordered by BeerBoard Index.</p></div></div>{beers.length ? <BeerRankingTable beers={beers} /> : <div className="empty-state"><h2>No examples in this release</h2><p>The style definition remains available even when no demonstration beers are indexed.</p></div>}</section>
    </div>
  );
}

function numeric(value: unknown) {
  return typeof value === "number" ? value : 0;
}

function range(min: number | null, max: number | null, suffix: string) {
  return min === null || max === null ? null : `${min}${suffix}–${max}${suffix}`;
}
