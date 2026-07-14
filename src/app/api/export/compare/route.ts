import { NextResponse, type NextRequest } from "next/server";
import { getBeerBySlug } from "@/lib/catalog";
import { rowsToCsv } from "@/lib/csv";

export async function GET(request: NextRequest) {
  const leftSlug = request.nextUrl.searchParams.get("a") ?? "";
  const rightSlug = request.nextUrl.searchParams.get("b") ?? "";
  if (!leftSlug || !rightSlug || leftSlug === rightSlug) {
    return NextResponse.json({ error: "Choose two different beers." }, { status: 400 });
  }
  const [left, right] = await Promise.all([getBeerBySlug(leftSlug), getBeerBySlug(rightSlug)]);
  if (!left || !right) return NextResponse.json({ error: "A selected beer was not found." }, { status: 404 });

  const rows: Array<Array<string | number | null>> = [
    ["Metric", left.name, right.name],
    ["Brewery", left.brewery_name, right.brewery_name],
    ["Country", left.country_name, right.country_name],
    ["Style", left.style_name, right.style_name],
    ["Index score", left.index_score, right.index_score],
    ["ABV", left.abv, right.abv],
    ["IBU", left.ibu, right.ibu],
    ["Calories", left.calories, right.calories],
    ["Aroma", left.aroma, right.aroma],
    ["Bitterness", left.bitterness, right.bitterness],
    ["Sweetness", left.sweetness, right.sweetness],
    ["Body", left.body, right.body],
    ["Brightness", left.brightness, right.brightness],
    ["Finish", left.finish, right.finish],
  ];
  return new NextResponse(rowsToCsv(rows), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="beerboard-${left.slug}-vs-${right.slug}.csv"`,
      "cache-control": "private, no-store",
    },
  });
}
