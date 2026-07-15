"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import styles from "@/app/styles/styles.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type FeaturedFamily = {
  name: string;
  sampleStyles: string[];
};

export function StyleDiscoveryIntro({ families }: { families: FeaturedFamily[] }) {
  const scope = useRef<HTMLDivElement>(null);
  const explorer = useRef<HTMLElement>(null);
  const familyLead = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const media = gsap.matchMedia();

    media.add("(min-width: 49rem)", () => {
      gsap.fromTo(
        `.${styles.heroImage}`,
        { scale: 1 },
        {
          scale: 1.08,
          opacity: 0.62,
          ease: "none",
          scrollTrigger: {
            trigger: `.${styles.hero}`,
            start: "top 4.25rem",
            end: "bottom top+=4.25rem",
            scrub: 0.7,
          },
        },
      );

      if (explorer.current && familyLead.current) {
        ScrollTrigger.create({
          trigger: explorer.current,
          start: "top 6rem",
          end: "bottom 14rem",
          pin: familyLead.current,
          pinSpacing: false,
        });
      }
    });

    return () => media.revert();
  }, { scope });

  return (
    <div ref={scope}>
      <header className={styles.hero}>
        <Image
          className={styles.heroImage}
          src="/images/beer-style-spectrum.png"
          alt="Five glasses show beer styles ranging from pale and hazy to fruity, amber, and dark."
          fill
          priority
          sizes="100vw"
        />
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <h1>Find the shape of beer you love.</h1>
            <p>Styles are useful signposts, not rules. Follow color, aroma, strength, and bitterness toward a beer that sounds like you.</p>
          </div>
        </div>
      </header>

      {families.length ? (
        <section className={styles.familyExplorer} ref={explorer} aria-labelledby="family-explorer-title">
          <div className={styles.familyLead} ref={familyLead}>
            <h2 id="family-explorer-title">Choose a character.</h2>
            <p>From bright and crisp to deep and roasty, each family opens a different path through the catalog.</p>
          </div>
          <nav className={styles.familyRail} aria-label="Featured style families">
            {families.map((family) => (
              <Link
                className={styles.familyLink}
                data-tone={familyTone(family.name)}
                href={`#family-${slugify(family.name)}`}
                key={family.name}
              >
                <Image
                  className={styles.familyImage}
                  src="/images/beer-style-spectrum.png"
                  alt=""
                  fill
                  sizes="(max-width: 48rem) 100vw, 22vw"
                  style={{ objectPosition: familyFocus(family.name) }}
                />
                <span className={styles.familyWash} aria-hidden="true" />
                <span className={styles.familyContent}>
                  <strong>{family.name}</strong>
                  <small>{family.sampleStyles.join(" · ")}</small>
                </span>
                <ArrowRight aria-hidden="true" />
              </Link>
            ))}
          </nav>
        </section>
      ) : null}
    </div>
  );
}

function familyTone(family: string) {
  const value = family.toLocaleLowerCase();
  if (value.includes("dark")) return "dark";
  if (value.includes("wild") || value.includes("sour")) return "fruit";
  if (value.includes("hop")) return "hop";
  if (value.includes("wheat") || value.includes("farmhouse")) return "wheat";
  if (value.includes("lager")) return "lager";
  return "amber";
}

function familyFocus(family: string) {
  const tone = familyTone(family);
  return {
    dark: "92% center",
    fruit: "64% center",
    hop: "79% center",
    wheat: "50% center",
    lager: "36% center",
    amber: "78% center",
  }[tone];
}

function slugify(value: string) {
  return value.toLocaleLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/(^-|-$)/g, "");
}
