import { ArrowLeftRight, BookOpen, MapPin } from "lucide-react";
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
  const sensory = { Aroma: beer.aroma, Bitterness: beer.bitterness, Sweetness: beer.sweetness, Body: beer.body, Brightness: beer.brightness, Finish: beer.finish };

  return (
    <div className="container page beer-profile-page">
      <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/beers">Discover</Link><span>/</span><Link href={`/styles/${beer.style_slug}`}>{beer.style_name}</Link><span>/</span><span aria-current="page">{beer.name}</span></nav>

      <header className="beer-profile-hero">
        <div className="beer-profile-copy">
          <div className="chip-list"><Link className="chip" href={`/countries/${beer.country_slug}`}><MapPin aria-hidden="true" size={14} />{beer.country_name}</Link><Link className="chip" href={`/styles/${beer.style_slug}`}>{beer.style_name}</Link></div>
          <h1 className="detail-title">{beer.name}</h1>
          <p className="beer-maker">Brewed by {beer.brewery_name}</p>
          <p className="lede">{beer.description}</p>
          <div className="detail-actions">
            <LedgerButton beerId={beer.id} beerSlug={beer.slug} />
            <Link className="button-ghost" href={`/compare?a=${beer.slug}`}><ArrowLeftRight aria-hidden="true" size={17} />Compare</Link>
            <Link className="text-link" href="/methodology"><BookOpen aria-hidden="true" size={17} />How the score works</Link>
          </div>
        </div>
        <div className="profile-visual">
          <BeerSpecimen name={beer.name} style={beer.style_name} country={beer.country_name} colorSrm={beer.color_srm} />
          <div className="profile-score" aria-label={`BeerBoard score ${beer.index_score.toFixed(1)} out of 100`}><span>BeerBoard score</span><strong>{beer.index_score.toFixed(1)}</strong><small>Number {beer.global_rank} in this release</small></div>
        </div>
      </header>
      <DatasetNotice release={release} />

      <section className="profile-measurements" aria-labelledby="technical-heading">
        <div className="profile-section-title"><h2 id="technical-heading">At a glance</h2><p>The useful numbers before the tasting notes.</p></div>
        <dl className="measurements measurement-strip">
          <Measurement label="Alcohol" value={beer.abv?.toFixed(1) ?? null} suffix="% ABV" />
          <Measurement label="Bitterness" value={beer.ibu} suffix=" IBU" />
          <Measurement label="Calories" value={beer.calories} suffix=" kcal" />
          <Measurement label="Color" value={beer.color_srm?.toFixed(1) ?? null} suffix=" SRM" />
        </dl>
      </section>

      <section className="profile-editorial" aria-labelledby="verdict-heading">
        <div className="profile-section-title"><h2 id="verdict-heading">Why it stands out</h2><p>A plain-language reading of the profile.</p></div>
        <article><p>{beer.editorial_verdict}</p><p>{beer.methodology_note}</p></article>
      </section>

      <section className="sensory-band" aria-labelledby="sensory-heading">
        <div className="profile-section-title"><h2 id="sensory-heading">How it drinks</h2><p>Six normalized dimensions from 0 to 10. Exact values are included beside the chart.</p></div>
        <SensoryProfile values={sensory} title={`${beer.name} sensory profile`} />
      </section>

      <section className="profile-details" aria-labelledby="descriptor-heading">
        <div><div className="profile-section-title"><h2 id="descriptor-heading">What to look for</h2><p>Dominant descriptors and assessment components from this release.</p></div></div>
        <div className="profile-detail-columns">
          <div><h3>Dominant descriptors</h3>{descriptors.length ? <dl className="measurements">{descriptors.map((descriptor) => <Measurement key={descriptor.name} label={`${descriptor.name} · ${descriptor.category}`} value={descriptor.intensity.toFixed(1)} suffix=" / 10" />)}</dl> : <p>No descriptors have been reported for this beer.</p>}</div>
          <div><h3>Assessment components</h3><dl className="measurements"><Measurement label="Quality" value={beer.quality.toFixed(1)} /><Measurement label="Balance" value={beer.balance.toFixed(1)} /><Measurement label="Distinctiveness" value={beer.distinctiveness.toFixed(1)} /><Measurement label="Technical execution" value={beer.technical_execution.toFixed(1)} /><Measurement label="Original gravity" value={beer.original_gravity?.toFixed(3) ?? null} /><Measurement label="Final gravity" value={beer.final_gravity?.toFixed(3) ?? null} /></dl></div>
        </div>
      </section>
    </div>
  );
}
