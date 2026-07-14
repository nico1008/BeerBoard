import type { Metadata } from "next";
import Link from "next/link";
import { ComparisonMetric } from "@/components/comparison-metric";
import { ComparisonSelectors } from "@/components/comparison-selectors";
import { DatasetNotice } from "@/components/dataset-notice";
import { ExportButton } from "@/components/export-button";
import { buildComparisonNotes } from "@/lib/comparison";
import { getBeerBySlug, getLatestRelease, listBeerOptions } from "@/lib/catalog";

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
  const [options, release, left, right] = await Promise.all([
    listBeerOptions(),
    getLatestRelease(),
    leftSlug ? getBeerBySlug(leftSlug) : Promise.resolve(null),
    rightSlug ? getBeerBySlug(rightSlug) : Promise.resolve(null),
  ]);
  const sameBeer = Boolean(leftSlug && rightSlug && leftSlug === rightSlug);
  const invalid = Boolean((leftSlug && !left) || (rightSlug && !right));
  const complete = Boolean(left && right && !sameBeer);

  return (
    <div className="container page">
      <header className="page-header">
        <div><h1>Compare beers</h1><p>Inspect two technical and sensory profiles side by side. Differences are evidence of tradeoffs, not proof of an overall winner.</p></div>
      </header>
      <DatasetNotice release={release} />
      <ComparisonSelectors options={options} left={leftSlug} right={rightSlug} />

      {sameBeer ? (
        <div className="empty-state"><h2>Choose two different beers</h2><p>A beer cannot be compared with itself. Keep Subject A and select a different Subject B.</p></div>
      ) : invalid ? (
        <div className="empty-state"><h2>One selection is not in this release</h2><p>Use the searchable suggestions to choose a current catalog slug. Any valid selection above has been preserved.</p></div>
      ) : !complete ? (
        <div className="empty-state"><h2>Select two beers to begin</h2><p>Search by beer name in each field. The selected slugs remain in the URL so the comparison can be shared.</p></div>
      ) : left && right ? (
        <>
          <div className="ranking-summary">
            <p>Comparing {left.name} with {right.name}</p>
            <ExportButton href={`/api/export/compare?a=${left.slug}&b=${right.slug}`} label="Export comparison" />
          </div>
          <section className="compare-subjects" aria-label="Selected beers">
            {[left, right].map((beer, index) => (
              <article className="panel" key={beer.id}>
                <div className="subject-header">
                  <div><span className="table-label">Subject {index === 0 ? "A" : "B"}</span><h2><Link href={`/beers/${beer.slug}`}>{beer.name}</Link></h2><p>{beer.brewery_name} · {beer.country_name}</p></div>
                  <span className="score">{beer.index_score.toFixed(1)}</span>
                </div>
                <p>{beer.style_name}</p>
              </article>
            ))}
          </section>
          <section className="section panel" aria-labelledby="technical-comparison">
            <h2 id="technical-comparison">Technical measurements</h2>
            <dl className="comparison-table">
              <div className="comparison-row"><dt>Metric</dt><dd>{left.name}</dd><dd>{right.name}</dd></div>
              <ComparisonMetric label="Alcohol" left={left.abv} right={right.abv} suffix="%" />
              <ComparisonMetric label="Bitterness" left={left.ibu} right={right.ibu} suffix=" IBU" tolerance={0.5} />
              <ComparisonMetric label="Calories" left={left.calories} right={right.calories} suffix=" kcal" tolerance={0.5} />
              <ComparisonMetric label="Original gravity" left={left.original_gravity} right={right.original_gravity} tolerance={0.001} />
              <ComparisonMetric label="Final gravity" left={left.final_gravity} right={right.final_gravity} tolerance={0.001} />
              <ComparisonMetric label="Color" left={left.color_srm} right={right.color_srm} suffix=" SRM" />
            </dl>
          </section>
          <section className="section panel" aria-labelledby="sensory-comparison">
            <h2 id="sensory-comparison">Sensory assessment</h2>
            <dl className="comparison-table">
              <div className="comparison-row"><dt>Dimension</dt><dd>{left.name}</dd><dd>{right.name}</dd></div>
              <ComparisonMetric label="Aroma" left={left.aroma} right={right.aroma} />
              <ComparisonMetric label="Bitterness" left={left.bitterness} right={right.bitterness} />
              <ComparisonMetric label="Sweetness" left={left.sweetness} right={right.sweetness} />
              <ComparisonMetric label="Body" left={left.body} right={right.body} />
              <ComparisonMetric label="Brightness" left={left.brightness} right={right.brightness} />
              <ComparisonMetric label="Finish" left={left.finish} right={right.finish} />
            </dl>
          </section>
          <section className="analysis" aria-labelledby="analysis-heading">
            <h2 id="analysis-heading">Comparison notes</h2>
            <ul>{buildComparisonNotes(left, right).map((note) => <li key={note}>{note}</li>)}</ul>
          </section>
        </>
      ) : null}
    </div>
  );
}
