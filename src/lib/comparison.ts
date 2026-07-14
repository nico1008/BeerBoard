import type { BeerCatalogRow } from "@/lib/supabase/database.types";

export type ComparisonState = "higher" | "lower" | "equal" | "unavailable";

export function compareNumbers(
  left: number | null,
  right: number | null,
  tolerance = 0.05,
): { left: ComparisonState; right: ComparisonState } {
  if (left === null || right === null) return { left: "unavailable", right: "unavailable" };
  if (Math.abs(left - right) <= tolerance) return { left: "equal", right: "equal" };
  return left > right
    ? { left: "higher", right: "lower" }
    : { left: "lower", right: "higher" };
}

export function buildComparisonNotes(left: BeerCatalogRow, right: BeerCatalogRow) {
  const notes: string[] = [];
  const abvDifference = valueDifference(left.abv, right.abv);
  const bitternessDifference = valueDifference(left.ibu, right.ibu);
  const bodyDifference = left.body - right.body;
  const brightnessDifference = left.brightness - right.brightness;

  if (abvDifference !== null && Math.abs(abvDifference) >= 1.5) {
    const stronger = abvDifference > 0 ? left : right;
    notes.push(`${stronger.name} has the higher alcohol strength, which may read as greater warmth and structural weight.`);
  }

  if (bitternessDifference !== null && Math.abs(bitternessDifference) >= 10) {
    const moreBitter = bitternessDifference > 0 ? left : right;
    notes.push(`${moreBitter.name} reports the higher bitterness level, while the other selection may feel less assertive on the palate.`);
  }

  if (Math.abs(bodyDifference) >= 1.5) {
    const fuller = bodyDifference > 0 ? left : right;
    notes.push(`${fuller.name} has the fuller assessed body of the pair.`);
  }

  if (Math.abs(brightnessDifference) >= 1.5) {
    const brighter = brightnessDifference > 0 ? left : right;
    notes.push(`${brighter.name} shows the brighter sensory profile, favoring lift and refreshment over weight.`);
  }

  if (notes.length === 0) {
    notes.push("The measured profiles are closely matched. The most useful distinction is style character rather than metric magnitude.");
  }

  notes.push("These measurements describe tradeoffs, not an overall winner. Preference depends on context, style expectations, and the drinker’s goals.");
  return notes;
}

function valueDifference(left: number | null, right: number | null) {
  return left === null || right === null ? null : left - right;
}
