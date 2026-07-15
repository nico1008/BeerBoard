import type { Metadata } from "next";
import Link from "next/link";
import { ComparisonMetric } from "@/components/comparison-metric";
import { ComparisonSelectors } from "@/components/comparison-selectors";
import { CountryFlag } from "@/components/country-flag";
import { ExportButton } from "@/components/export-button";
import { buildComparisonNotes } from "@/lib/comparison";
import { getBeerBySlug, listBeerOptions } from "@/lib/catalog";

export const metadata: Metadata = { title: "Compare beers" };
export const revalidate = 3600;

function cleanSlug(value: string | string[] | undefined) {
  const first = Array.isArray(value) ? value[0] : value;
  return first && /^[a-z0-9-]{1,100}$/.test(first) ? first : "";
}

export default async function ComparePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const leftSlug = cleanSlug(params.a);
  const rightSlug = cleanSlug(params.b);
  const [options, left, right] = await Promise.all([listBeerOptions(), leftSlug ? getBeerBySlug(leftSlug) : Promise.resolve(null), rightSlug ? getBeerBySlug(rightSlug) : Promise.resolve(null)]);
  const sameBeer = Boolean(leftSlug && rightSlug && leftSlug === rightSlug);
  const invalid = Boolean((leftSlug && !left) || (rightSlug && !right));
  const complete = Boolean(left && right && !sameBeer);

  return (
    <div className="container page compare-page">
      <header className="page-header compare-header"><div><h1>Compare two pours</h1><p>See strength, bitterness, body, and finish side by side. The differences help you choose; they do not declare a universal winner.</p></div></header>
      <ComparisonSelectors options={options} left={leftSlug} right={rightSlug} />

      {sameBeer ? <div className="empty-state"><h2>Choose two different beers</h2><p>Keep either selection, then choose another beer for the other side.</p></div>
        : invalid ? <div className="empty-state"><h2>That beer is not in this release</h2><p>Choose a beer from the current catalog. Any valid selection has been preserved.</p></div>
        : !complete ? <div className="comparison-invitation"><h2>Start with two beers.</h2><p>Choose one beer for each side. Your selections stay in the URL, ready to revisit or share.</p></div>
        : left && right ? <>
          <div className="ranking-summary"><p>Comparing {left.name} and {right.name}</p><ExportButton href={`/api/export/compare?a=${left.slug}&b=${right.slug}`} label="Download comparison" /></div>
          <section className="compare-subjects" aria-label="Selected beers">
            {[left, right].map((beer, index) => <article className="compare-subject" key={beer.id}><div><span>{index === 0 ? "First beer" : "Second beer"}</span><h2><Link href={`/beers/${beer.slug}`}>{beer.name}</Link></h2><p className="country-inline">{beer.brewery_name} · <CountryFlag isoCode={beer.iso_code} />{beer.country_name}</p><Link href={`/styles/${beer.style_slug}`}>{beer.style_name}</Link></div><strong>{beer.index_score.toFixed(1)}</strong></article>)}
          </section>
          <section className="section comparison-section" aria-labelledby="technical-comparison"><h2 id="technical-comparison">Technical profile</h2><dl className="comparison-table"><div className="comparison-row"><dt>Measure</dt><dd>{left.name}</dd><dd>{right.name}</dd></div><ComparisonMetric label="Alcohol" left={left.abv} right={right.abv} suffix="%" /><ComparisonMetric label="Bitterness" left={left.ibu} right={right.ibu} suffix=" IBU" tolerance={0.5} /><ComparisonMetric label="Calories" left={left.calories} right={right.calories} suffix=" kcal" tolerance={0.5} /><ComparisonMetric label="Original gravity" left={left.original_gravity} right={right.original_gravity} tolerance={0.001} /><ComparisonMetric label="Final gravity" left={left.final_gravity} right={right.final_gravity} tolerance={0.001} /><ComparisonMetric label="Color" left={left.color_srm} right={right.color_srm} suffix=" SRM" /></dl></section>
          <section className="section comparison-section" aria-labelledby="sensory-comparison"><h2 id="sensory-comparison">How they drink</h2><dl className="comparison-table"><div className="comparison-row"><dt>Dimension</dt><dd>{left.name}</dd><dd>{right.name}</dd></div><ComparisonMetric label="Aroma" left={left.aroma} right={right.aroma} /><ComparisonMetric label="Bitterness" left={left.bitterness} right={right.bitterness} /><ComparisonMetric label="Sweetness" left={left.sweetness} right={right.sweetness} /><ComparisonMetric label="Body" left={left.body} right={right.body} /><ComparisonMetric label="Brightness" left={left.brightness} right={right.brightness} /><ComparisonMetric label="Finish" left={left.finish} right={right.finish} /></dl></section>
          <section className="analysis" aria-labelledby="analysis-heading"><h2 id="analysis-heading">What the differences mean</h2><ul>{buildComparisonNotes(left, right).map((note) => <li key={note}>{note}</li>)}</ul></section>
        </> : null}
    </div>
  );
}
