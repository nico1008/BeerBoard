"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, GitCompareArrows, Map, MessageSquareText, Shapes } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type StyleLink = { name: string; slug: string };

export function BeerDiscovery({ styles }: { styles: StyleLink[] }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const media = gsap.matchMedia();
    media.add("(min-width: 900px)", () => {
      gsap.to(".hero-pour-inner", { scale: 1.08, yPercent: 8, ease: "none", scrollTrigger: { trigger: ".discovery-hero", start: "top top", end: "bottom top", scrub: 0.7 } });
      gsap.utils.toArray<HTMLElement>(".story-chapter").forEach((chapter) => {
        gsap.fromTo(chapter, { opacity: 0.42, scale: 0.93 }, { opacity: 1, scale: 1, ease: "none", scrollTrigger: { trigger: chapter, start: "top 72%", end: "center 52%", scrub: 0.6 } });
      });
      ScrollTrigger.create({ trigger: ".discovery-story", start: "top 7rem", end: "bottom 72%", pin: ".story-intro", pinSpacing: false });
    });
    return () => media.revert();
  }, { scope });

  const marqueeStyles = styles.slice(0, 10);

  return (
    <div ref={scope}>
      <section className="discovery-hero" aria-labelledby="discovery-title">
        <div className="container hero-grid">
          <div className="hero-copy">
            <h1 id="discovery-title">Find a beer worth <span className="hero-inline-pour" aria-hidden="true" /> talking about.</h1>
            <p>Explore standout beers by taste, place, and style. BeerBoard keeps the details clear, so curiosity can lead the way.</p>
            <div className="hero-actions">
              <Link className="button" href="/beers">Browse the ranking<ArrowRight aria-hidden="true" size={18} /></Link>
              <Link className="text-link" href="/compare">Compare two beers<ArrowRight aria-hidden="true" size={17} /></Link>
            </div>
          </div>
          <div className="hero-pour" aria-hidden="true">
            <div className="hero-pour-inner"><div className="beer-glass"><span className="beer-foam" /><span className="beer-liquid"><i /><i /><i /><i /></span></div></div>
            <p>From crisp lagers to deep imperial stouts</p>
          </div>
        </div>
      </section>

      <div className="style-marquee" aria-label="Explore popular beer styles">
        <div className="style-marquee-track">
          {[...marqueeStyles, ...marqueeStyles].map((style, index) => <Link href={`/styles/${style.slug}`} aria-hidden={index >= marqueeStyles.length} tabIndex={index >= marqueeStyles.length ? -1 : undefined} key={`${style.slug}-${index}`}>{style.name}<span>•</span></Link>)}
        </div>
      </div>

      <section className="container discovery-bento" aria-label="Ways to explore BeerBoard">
        <Link className="discovery-card discovery-card-wide" href="/countries"><Map aria-hidden="true" /><span><strong>Follow beer across the map</strong><small>Meet the places and brewing cultures represented in the current catalog.</small></span><ArrowRight aria-hidden="true" /></Link>
        <Link className="discovery-card discovery-card-narrow discovery-card-amber" href="/styles"><Shapes aria-hidden="true" /><span><strong>Find your style</strong><small>Learn what separates a bright pilsner from a rich quadrupel.</small></span><ArrowRight aria-hidden="true" /></Link>
        <Link className="discovery-card discovery-card-narrow discovery-card-green" href="/compare"><GitCompareArrows aria-hidden="true" /><span><strong>Taste the difference</strong><small>Put two beers side by side without turning either one into a winner or loser.</small></span><ArrowRight aria-hidden="true" /></Link>
        <Link className="discovery-card discovery-card-wide" href="/beers"><MessageSquareText aria-hidden="true" /><span><strong>Share what you tasted</strong><small>Rate a beer and leave a useful note for the next curious drinker.</small></span><ArrowRight aria-hidden="true" /></Link>
      </section>

      <section className="container discovery-story" aria-labelledby="story-title">
        <div className="story-intro"><p>Explore your way</p><h2 id="story-title">A better beer search starts with the question you already have.</h2></div>
        <div className="story-chapters">
          <article className="story-chapter"><span>01</span><div><h3>Start with a feeling</h3><p>Looking for something crisp, roasty, bright, or comforting? Style and sensory notes translate the numbers into language you can use.</p><Link href="/styles">Explore styles<ArrowRight aria-hidden="true" size={16} /></Link></div></article>
          <article className="story-chapter"><span>02</span><div><h3>Follow a place</h3><p>Beer carries the character of its brewing culture. Country pages connect leading bottles with the regions and makers behind them.</p><Link href="/countries">Explore countries<ArrowRight aria-hidden="true" size={16} /></Link></div></article>
          <article className="story-chapter"><span>03</span><div><h3>Compare the tradeoffs</h3><p>Strength, bitterness, body, and finish tell different stories. Compare them side by side without pretending one profile suits everyone.</p><Link href="/compare">Start a comparison<ArrowRight aria-hidden="true" size={16} /></Link></div></article>
        </div>
      </section>
    </div>
  );
}
