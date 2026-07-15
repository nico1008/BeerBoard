import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/styles/styles.module.css";

type FeaturedFamily = {
  image: string;
  name: string;
  sampleStyles: string[];
};

export function StyleDiscoveryIntro({ families }: { families: FeaturedFamily[] }) {
  return (
    <>
      <header className={styles.hero}>
        <Image
          className={styles.heroImage}
          src="/images/beer-style-spectrum.png"
          alt=""
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
        <section className={styles.familyExplorer} aria-labelledby="family-explorer-title">
          <header className={styles.familyLead}>
            <h2 id="family-explorer-title">Choose a character.</h2>
            <p>Five distinct routes into the catalog. Each opens the matching family below.</p>
          </header>
          <nav className={styles.familyMosaic} aria-label="Featured style families">
            {families.map((family, index) => (
              <Link
                className={styles.familyTile}
                data-layout={index}
                href={`#family-${slugify(family.name)}`}
                key={family.name}
              >
                <Image
                  className={styles.familyImage}
                  src={family.image}
                  alt=""
                  fill
                  sizes={index === 0 ? "(max-width: 48rem) 100vw, 40vw" : "(max-width: 48rem) 100vw, 30vw"}
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
    </>
  );
}

function slugify(value: string) {
  return value.toLocaleLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/(^-|-$)/g, "");
}
