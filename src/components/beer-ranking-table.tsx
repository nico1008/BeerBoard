import Link from "next/link";
import type { BeerCatalogRow } from "@/lib/supabase/database.types";

export function BeerRankingTable({ beers }: { beers: BeerCatalogRow[] }) {
  return (
    <div className="table-shell">
      <table className="data-table">
        <caption className="sr-only">Global demonstration beer ranking</caption>
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Beer and brewery</th>
            <th scope="col">Country</th>
            <th scope="col">Style</th>
            <th scope="col">ABV</th>
            <th scope="col">Index</th>
          </tr>
        </thead>
        <tbody>
          {beers.map((beer) => (
            <tr key={beer.id}>
              <td className="rank-cell" data-label="Rank">{String(beer.global_rank).padStart(2, "0")}</td>
              <td className="beer-cell" data-label="Beer">
                <Link href={`/beers/${beer.slug}`}>{beer.name}</Link>
                <span>{beer.brewery_name}</span>
              </td>
              <td data-label="Country"><Link href={`/countries/${beer.country_slug}`}>{beer.country_name}</Link></td>
              <td data-label="Style"><Link className="chip" href={`/styles/${beer.style_slug}`}>{beer.style_name}</Link></td>
              <td data-label="ABV">{beer.abv === null ? "Not reported" : `${beer.abv.toFixed(1)}%`}</td>
              <td data-label="Index"><span className="score">{beer.index_score.toFixed(1)}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
