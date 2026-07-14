import { ArrowLeftRight, CircleHelp } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BeerSpecimen } from "@/components/beer-specimen";
import { DatasetNotice } from "@/components/dataset-notice";
import { LedgerButton } from "@/components/ledger-button";
import { Measurement } from "@/components/measurement";
import { SensoryProfile } from "@/components/sensory-profile";
import { getBeerBySlug, getBeerDescriptors, getLatestRelease } from "@/lib/catalog";

export const revalidate = 3600;

export default async function BeerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const beer = await getBeerBySlug(slug);
  if (!beer) notFound();
  const [descriptors, release] = await Promise.all([getBeerDescriptors(beer.id), getLatestRelease()]);
  const sensory = {
    Aroma: beer.aroma,
    Bitterness: beer.bitterness,
    Sweetness: beer.sweetness,
    Body: beer.body,
    Brightness: beer.brightness,
    Finish: beer.finish,
  };

  return (
    <div className="container page">
      <div className="detail-grid">
        <div>
          <div className="chip-list">
            <Link className="chip" href={`/countries/${beer.country_slug}`}>{beer.country_name}</Link>
            <Link className="chip" href={`/styles/${beer.style_slug}`}>{beer.style_name}</Link>
          </div>
          <h1 className="detail-title" style={{ marginTop: "1rem" }}>{beer.name}</h1>
          <p className="lede">{beer.description}</p>
          <div className="detail-meta">
            <span>{beer.brewery_name}</span>
            <span>Global rank #{beer.global_rank}</span>
          </div>
          <div className="detail-actions">
            <LedgerButton beerId={beer.id} beerSlug={beer.slug} />
            <Link className="button-ghost" href={`/compare?a=${beer.slug}`}><ArrowLeftRight size={17} />Compare</Link>
            <Link className="button-ghost" href="/methodology"><CircleHelp size={17} />How scoring works</Link>
          </div>
        </div>
        <aside className="score-panel" aria-label={`BeerBoard Index score ${beer.index_score.toFixed(1)} out of 100`}>
          <p>BeerBoard Index</p>
          <strong>{beer.index_score.toFixed(1)}</strong>
          <p>Ranked #{beer.global_rank} in this demonstration release</p>
        </aside>
      </div>
      <DatasetNotice release={release} />

      <section className="section content-grid" aria-labelledby="technical-heading">
        <div className="panel">
          <h2 id="technical-heading">Technical profile</h2>
          <dl className="measurements">
            <Measurement label="Alcohol" value={beer.abv?.toFixed(1) ?? null} suffix="% ABV" />
            <Measurement label="Bitterness" value={beer.ibu} suffix=" IBU" />
            <Measurement label="Calories" value={beer.calories} suffix=" kcal" />
            <Measurement label="Original gravity" value={beer.original_gravity?.toFixed(3) ?? null} />
            <Measurement label="Final gravity" value={beer.final_gravity?.toFixed(3) ?? null} />
            <Measurement label="Color" value={beer.color_srm?.toFixed(1) ?? null} suffix=" SRM" />
          </dl>
        </div>
        <article className="panel">
          <h2>Editorial verdict</h2>
          <p>{beer.editorial_verdict}</p>
          <p>{beer.methodology_note}</p>
        </article>
      </section>

      <section className="section panel" aria-labelledby="sensory-heading">
        <div className="section-heading">
          <div><h2 id="sensory-heading">Sensory profile</h2><p>Normalized assessment values from 0 to 10. The exact numbers provide the accessible alternative to the chart.</p></div>
        </div>
        <SensoryProfile values={sensory} title={`${beer.name} sensory profile`} />
      </section>

      <section className="section content-grid">
        <BeerSpecimen name={beer.name} style={beer.style_name} country={beer.country_name} />
        <div className="panel">
          <h2>Dominant descriptors</h2>
          {descriptors.length ? (
            <dl className="measurements">
              {descriptors.map((descriptor) => (
                <Measurement key={descriptor.name} label={`${descriptor.name} · ${descriptor.category}`} value={descriptor.intensity.toFixed(1)} suffix=" / 10" />
              ))}
            </dl>
          ) : <p>No descriptors have been reported for this beer.</p>}
          <h2 style={{ marginTop: "2rem" }}>Assessment components</h2>
          <dl className="measurements">
            <Measurement label="Quality" value={beer.quality.toFixed(1)} />
            <Measurement label="Balance" value={beer.balance.toFixed(1)} />
            <Measurement label="Distinctiveness" value={beer.distinctiveness.toFixed(1)} />
            <Measurement label="Technical execution" value={beer.technical_execution.toFixed(1)} />
          </dl>
        </div>
      </section>
    </div>
  );
}
