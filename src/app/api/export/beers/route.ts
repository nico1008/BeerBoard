import { NextResponse, type NextRequest } from "next/server";
import { listBeers } from "@/lib/catalog";
import { rowsToCsv } from "@/lib/csv";
import { parseRankingFilters } from "@/lib/ranking";

export async function GET(request: NextRequest) {
  const filters = parseRankingFilters(Object.fromEntries(request.nextUrl.searchParams));
  const { beers } = await listBeers(filters, true);
  const csv = rowsToCsv([
    ["Rank", "Beer", "Brewery", "Country", "Style", "ABV", "IBU", "Index score"],
    ...beers.map((beer) => [beer.global_rank, beer.name, beer.brewery_name, beer.country_name, beer.style_name, beer.abv, beer.ibu, beer.index_score]),
  ]);
  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="beerboard-ranking.csv"',
      "cache-control": "private, no-store",
    },
  });
}
