import { z } from "zod";

const sortValues = ["rank", "score", "name", "abv", "country", "style"] as const;
const directionValues = ["asc", "desc"] as const;

const filterSchema = z.object({
  q: z.string().trim().max(80).catch(""),
  country: z.string().trim().regex(/^[a-z0-9-]*$/).catch(""),
  style: z.string().trim().regex(/^[a-z0-9-]*$/).catch(""),
  minScore: z.coerce.number().min(0).max(100).catch(0),
  sort: z.enum(sortValues).catch("rank"),
  direction: z.enum(directionValues).catch("asc"),
  page: z.coerce.number().int().min(1).catch(1),
});

export type RankingFilters = z.infer<typeof filterSchema>;

export function parseRankingFilters(params: Record<string, string | string[] | undefined>): RankingFilters {
  return filterSchema.parse({
    q: first(params.q),
    country: first(params.country),
    style: first(params.style),
    minScore: first(params.minScore),
    sort: first(params.sort),
    direction: first(params.direction),
    page: first(params.page),
  });
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export const PAGE_SIZE = 10;

export function filtersToSearchParams(filters: RankingFilters, includePage = true) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.country) params.set("country", filters.country);
  if (filters.style) params.set("style", filters.style);
  if (filters.minScore > 0) params.set("minScore", String(filters.minScore));
  if (filters.sort !== "rank") params.set("sort", filters.sort);
  if (filters.direction !== "asc") params.set("direction", filters.direction);
  if (includePage && filters.page > 1) params.set("page", String(filters.page));
  return params;
}

export function sanitizeSearchTerm(term: string) {
  return term.replace(/[,%()]/g, " ").replace(/\s+/g, " ").trim();
}
