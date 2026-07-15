import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { StyleDiscoveryIntro } from "@/components/style-discovery-intro";
import { listStyles } from "@/lib/catalog";
import stylesModule from "./styles.module.css";

export const metadata: Metadata = { title: "Beer styles" };
export const revalidate = 3600;

const featuredFamilyArt = [
  { name: "Dark ale", image: "/images/styles/dark-ale.webp" },
  { name: "Lager", image: "/images/styles/lager.webp" },
  { name: "Hop-forward ale", image: "/images/styles/hop-forward.webp" },
  { name: "Wild and sour", image: "/images/styles/wild-sour.webp" },
  { name: "Wheat beer", image: "/images/styles/wheat.webp" },
] as const;

export default async function StylesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = (rawQuery ?? "").trim().toLocaleLowerCase().slice(0, 80);
  const styles = await listStyles();
  const allFamilies = Map.groupBy(styles, (style) => style.family);
  const filtered = styles.filter((style) => !query || style.name.toLocaleLowerCase().includes(query) || style.family.toLocaleLowerCase().includes(query));
  const families = Map.groupBy(filtered, (style) => style.family);
  const featuredFamilies = featuredFamilyArt.flatMap(({ name, image }) => {
    const familyStyles = allFamilies.get(name);
    return familyStyles ? [{ image, name, sampleStyles: familyStyles.slice(0, 2).map((style) => style.name) }] : [];
  });

  return (
    <div className={`page styles-page ${stylesModule.page}`}>
      <StyleDiscoveryIntro families={query ? [] : featuredFamilies} />

      <div className={`container ${stylesModule.directory}`}>
        <section className={stylesModule.directoryHeader} aria-labelledby="style-directory-title">
          <div>
            <h2 id="style-directory-title">Every style has a different pull.</h2>
            <p>{filtered.length} {filtered.length === 1 ? "style" : "styles"} across {families.size} {families.size === 1 ? "family" : "families"}. All figures belong to the current fictional demonstration release.</p>
          </div>
          <form className={stylesModule.search} action="/styles" method="get">
            <Search aria-hidden="true" size={20} />
            <label className="sr-only" htmlFor="style-search">Search styles or families</label>
            <input id="style-search" name="q" type="search" defaultValue={rawQuery ?? ""} placeholder="Search lager, stout, sour, wheat…" />
            <button className="button-secondary" type="submit">Search</button>
          </form>
        </section>

        {filtered.length ? [...families.entries()].map(([family, familyStyles]) => (
          <section
            className={stylesModule.familySection}
            data-tone={familyTone(family)}
            aria-labelledby={`family-${slugify(family)}`}
            key={family}
          >
            <header className={stylesModule.familyHeader}>
              <div>
                <h2 id={`family-${slugify(family)}`}>{family}</h2>
                <p>{familyStyles.map((style) => style.name).join(" · ")}</p>
              </div>
              <span className={stylesModule.familyCount}>{familyStyles.length} {familyStyles.length === 1 ? "style" : "styles"}</span>
              <span className={stylesModule.familyMark} aria-hidden="true"><i /><i /><i /></span>
            </header>

            <div className={stylesModule.styleList}>
              {familyStyles.map((style) => (
                <article className={stylesModule.styleEntry} key={style.id}>
                  <div className={stylesModule.styleIdentity}>
                    <span className={stylesModule.styleSpecimen} aria-hidden="true"><i /><i /></span>
                    <div>
                      <h3><Link href={`/styles/${style.slug}`}>{style.name}</Link></h3>
                      <p>{style.summary}</p>
                    </div>
                  </div>

                  <dl className={stylesModule.measurements}>
                    <MeasurementRange label="Strength" min={style.typical_abv_min} max={style.typical_abv_max} scaleMax={15} suffix="%" />
                    <MeasurementRange label="Bitterness" min={style.typical_ibu_min} max={style.typical_ibu_max} scaleMax={120} suffix=" IBU" />
                  </dl>

                  <div className={stylesModule.leadingBeer}>
                    <span>Beer to explore</span>
                    {style.leading_beer_slug ? <Link href={`/beers/${style.leading_beer_slug}`}>{style.leading_beer_name}</Link> : <span>Not reported</span>}
                  </div>

                  <Link className={stylesModule.entryArrow} href={`/styles/${style.slug}`} aria-label={`Explore ${style.name}`}>
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )) : (
          <div className="empty-state">
            <h2>No styles match “{rawQuery}”</h2>
            <p>Try a broader style or family name, or clear the query to see the full catalog.</p>
            <Link className="button-ghost" href="/styles">Clear search</Link>
          </div>
        )}
      </div>
    </div>
  );
}

function MeasurementRange({ label, min, max, scaleMax, suffix }: { label: string; min: number | null; max: number | null; scaleMax: number; suffix: string }) {
  const reported = min !== null && max !== null;
  const start = reported ? Math.max(0, Math.min(100, (min / scaleMax) * 100)) : 0;
  const end = reported ? Math.max(start, Math.min(100, (max / scaleMax) * 100)) : 0;
  const rangeStyle = { "--range-start": `${start}%`, "--range-size": `${Math.max(4, end - start)}%` } as CSSProperties;

  return (
    <div className={stylesModule.measurement}>
      <div><dt>{label}</dt><dd>{formatRange(min, max, suffix)}</dd></div>
      <span className={stylesModule.rangeTrack} aria-hidden="true">
        {reported ? <i style={rangeStyle} /> : null}
      </span>
    </div>
  );
}

function familyTone(family: string) {
  const value = family.toLocaleLowerCase();
  if (value.includes("dark")) return "dark";
  if (value.includes("farmhouse")) return "farmhouse";
  if (value.includes("hop")) return "hop";
  if (value.includes("lager")) return "lager";
  if (value.includes("malt")) return "malt";
  if (value.includes("strong")) return "strong";
  if (value.includes("wheat")) return "wheat";
  if (value.includes("wild") || value.includes("sour")) return "sour";
  return "lager";
}

function formatRange(min: number | null, max: number | null, suffix = "") {
  return min === null || max === null ? "Not reported" : `${min}–${max}${suffix}`;
}

function slugify(value: string) {
  return value.toLocaleLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/(^-|-$)/g, "");
}
