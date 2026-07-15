import { ArrowUpRight, GitCompareArrows } from "lucide-react";
import Link from "next/link";
import { CountryFlag } from "@/components/country-flag";
import type { BeerCatalogRow } from "@/lib/supabase/database.types";

export function BeerRankingTable({ beers }: { beers: BeerCatalogRow[] }) {
  return (
    <ol className="beer-ranking" aria-label="Beer ranking">
      {beers.map((beer) => (
        <li className="beer-ranking-item" key={beer.id}>
          <span className="rank-number" aria-label={`Rank ${beer.global_rank}`}>{String(beer.global_rank).padStart(2, "0")}</span>
          <div className="ranked-beer">
            <h3><Link href={`/beers/${beer.slug}`}>{beer.name}<ArrowUpRight aria-hidden="true" size={19} /></Link></h3>
            <p>{beer.brewery_name}</p>
            <div className="ranked-beer-links">
              <Link href={`/countries/${beer.country_slug}`}><CountryFlag isoCode={beer.iso_code} />{beer.country_name}</Link>
              <Link href={`/styles/${beer.style_slug}`}>{beer.style_name}</Link>
            </div>
          </div>
          <div className="ranked-measure"><span>Strength</span><strong>{beer.abv === null ? "Not reported" : `${beer.abv.toFixed(1)}%`}</strong></div>
          <div className="ranked-score"><span>BeerBoard score</span><strong>{beer.index_score.toFixed(1)}</strong></div>
          <Link className="rank-compare" href={`/compare?a=${beer.slug}`} aria-label={`Compare ${beer.name}`}><GitCompareArrows aria-hidden="true" size={18} /><span>Compare</span></Link>
        </li>
      ))}
    </ol>
  );
}
