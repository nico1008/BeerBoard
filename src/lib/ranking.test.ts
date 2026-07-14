import { describe, expect, it } from "vitest";
import { filtersToSearchParams, parseRankingFilters, sanitizeSearchTerm } from "@/lib/ranking";

describe("ranking filters", () => {
  it("parses valid URL state", () => {
    expect(parseRankingFilters({ q: "porter", country: "united-states", minScore: "91.5", sort: "score", direction: "desc", page: "2" })).toEqual({
      q: "porter",
      country: "united-states",
      style: "",
      minScore: 91.5,
      sort: "score",
      direction: "desc",
      page: 2,
    });
  });

  it("rejects unsafe or out-of-range values to stable defaults", () => {
    expect(parseRankingFilters({ country: "../admin", minScore: "900", sort: "unknown", page: "0" })).toEqual({
      q: "",
      country: "",
      style: "",
      minScore: 0,
      sort: "rank",
      direction: "asc",
      page: 1,
    });
  });

  it("persists active filters without default noise", () => {
    const params = filtersToSearchParams(parseRankingFilters({ q: " saison ", style: "saison", page: "3" }));
    expect(params.toString()).toBe("q=saison&style=saison&page=3");
  });

  it("sanitizes PostgREST search punctuation", () => {
    expect(sanitizeSearchTerm("porter,(Belgium)%")).toBe("porter Belgium");
  });
});
