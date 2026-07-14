import { describe, expect, it } from "vitest";
import { buildComparisonNotes, compareNumbers } from "@/lib/comparison";
import type { BeerCatalogRow } from "@/lib/supabase/database.types";

const baseBeer: BeerCatalogRow = {
  id: 1,
  name: "Lantern Quadrupel",
  slug: "lantern-quadrupel",
  description: "Demonstration",
  abv: 10.4,
  ibu: 28,
  calories: 238,
  original_gravity: 1.094,
  final_gravity: 1.011,
  color_srm: 12,
  brewery_id: 1,
  brewery_name: "North Bell",
  brewery_slug: "north-bell",
  country_id: 1,
  country_name: "Belgium",
  country_slug: "belgium",
  iso_code: "BE",
  region: "Europe",
  style_id: 1,
  style_name: "Belgian Quadrupel",
  style_slug: "belgian-quadrupel",
  style_family: "Strong ale",
  index_score: 99.4,
  quality: 99,
  balance: 99,
  distinctiveness: 99,
  technical_execution: 99,
  aroma: 8.8,
  bitterness: 3.2,
  sweetness: 7.2,
  body: 8.5,
  brightness: 3.4,
  finish: 8.2,
  editorial_verdict: "Demonstration verdict",
  methodology_note: "Generated in PostgreSQL",
  assessed_at: "2026-07-14T00:00:00Z",
  global_rank: 1,
};

describe("comparison logic", () => {
  it("returns visible higher, lower, and equal states", () => {
    expect(compareNumbers(8, 5)).toEqual({ left: "higher", right: "lower" });
    expect(compareNumbers(5, 5.02)).toEqual({ left: "equal", right: "equal" });
    expect(compareNumbers(null, 5)).toEqual({ left: "unavailable", right: "unavailable" });
  });

  it("generates deterministic tradeoff notes without an overall winner", () => {
    const right = { ...baseBeer, id: 2, name: "Tideglass Pilsner", slug: "tideglass-pilsner", abv: 5, ibu: 40, body: 4, brightness: 9 };
    const notes = buildComparisonNotes(baseBeer, right);
    expect(notes.join(" ")).toContain("higher alcohol strength");
    expect(notes.join(" ")).toContain("brighter sensory profile");
    expect(notes.at(-1)).toContain("not an overall winner");
    expect(buildComparisonNotes(baseBeer, right)).toEqual(notes);
  });
});
