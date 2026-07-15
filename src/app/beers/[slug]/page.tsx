import { ArrowLeftRight, BookOpen, MessageSquareText, Star } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BeerSpecimen } from "@/components/beer-specimen";
import { CountryFlag } from "@/components/country-flag";
import { Measurement } from "@/components/measurement";
import { ReviewForm } from "@/components/review-form";
import { SaveBeerButton } from "@/components/save-beer-button";
import { SensoryProfile } from "@/components/sensory-profile";
import { getBeerBySlug, getBeerDescriptors, getBeerReviews } from "@/lib/catalog";

export const revalidate = 3600;

export default async function BeerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const beer = await getBeerBySlug(slug);
  if (!beer) notFound();
  const [descriptors, reviews] = await Promise.all([getBeerDescriptors(beer.id), getBeerReviews(beer.id)]);
  const sensory = { Aroma: beer.aroma, Bitterness: beer.bitterness, Sweetness: beer.sweetness, Body: beer.body, Brightness: beer.brightness, Finish: beer.finish };
  const averageRating = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : null;
  const reviewDate = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

  return (
    <div className="container page beer-profile-page">
      <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/beers">Discover</Link><span>/</span><Link href={`/styles/${beer.style_slug}`}>{beer.style_name}</Link><span>/</span><span aria-current="page">{beer.name}</span></nav>

      <header className="beer-profile-hero">
        <div className="beer-profile-copy">
          <div className="chip-list"><Link className="chip" href={`/countries/${beer.country_slug}`}><CountryFlag isoCode={beer.iso_code} />{beer.country_name}</Link><Link className="chip" href={`/styles/${beer.style_slug}`}>{beer.style_name}</Link></div>
          <h1 className="detail-title">{beer.name}</h1>
          <p className="beer-maker">Brewed by {beer.brewery_name}</p>
          <p className="lede">{beer.description}</p>
          <div className="detail-actions">
            <Link className="button" href="#reviews"><MessageSquareText aria-hidden="true" size={17} />Write a review</Link>
            <SaveBeerButton beerId={beer.id} beerSlug={beer.slug} />
            <Link className="button-ghost" href={`/compare?a=${beer.slug}`}><ArrowLeftRight aria-hidden="true" size={17} />Compare</Link>
            <Link className="text-link" href="/methodology"><BookOpen aria-hidden="true" size={17} />How the score works</Link>
          </div>
        </div>
        <div className="profile-visual">
          <BeerSpecimen name={beer.name} style={beer.style_name} country={beer.country_name} colorSrm={beer.color_srm} />
          <div className="profile-score" aria-label={`BeerBoard score ${beer.index_score.toFixed(1)} out of 100`}><span>BeerBoard score</span><strong>{beer.index_score.toFixed(1)}</strong><small>Number {beer.global_rank} in this release</small></div>
        </div>
      </header>

      <section className="community-reviews" id="reviews" aria-labelledby="reviews-heading">
        <div className="profile-section-title">
          <h2 id="reviews-heading">What drinkers say</h2>
          <p>{reviews.length ? `${reviews.length} ${reviews.length === 1 ? "review" : "reviews"}${averageRating ? ` · ${averageRating.toFixed(1)} out of 5` : ""}` : "Be the first to share what you noticed."}</p>
        </div>
        <div className="review-content">
          <ReviewForm beerId={beer.id} beerSlug={beer.slug} beerName={beer.name} />
          {reviews.length ? <div className="public-review-list" aria-label={`Reviews of ${beer.name}`}>{reviews.map((review) => <article key={review.id}>
            <header><div><strong>{review.author_name}</strong><time dateTime={review.updated_at}>{reviewDate.format(new Date(review.updated_at))}</time></div><p className="review-rating"><Star aria-hidden="true" size={17} fill="currentColor" />{review.rating} out of 5</p></header>
            <p>{review.body}</p>
          </article>)}</div> : null}
        </div>
      </section>

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
