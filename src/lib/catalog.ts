import "server-only";

import { getPublicClient } from "@/lib/supabase/public";
import type {
  BeerCatalogRow,
  CountrySummaryRow,
  Database,
  StyleSummaryRow,
} from "@/lib/supabase/database.types";
import { PAGE_SIZE, sanitizeSearchTerm, type RankingFilters } from "@/lib/ranking";

export type DatasetRelease = Database["public"]["Tables"]["dataset_releases"]["Row"];
export type BeerDescriptor = { name: string; category: string; intensity: number };

export class CatalogError extends Error {
  constructor(message: string, public readonly causeMessage?: string) {
    super(message);
    this.name = "CatalogError";
  }
}

function assertNoError(error: { message: string } | null, message: string) {
  if (error) throw new CatalogError(message, error.message);
}

export async function getLatestRelease() {
  const { data, error } = await getPublicClient()
    .from("dataset_releases")
    .select("*")
    .order("audited_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  assertNoError(error, "The dataset release could not be loaded.");
  return data;
}

const sortColumns: Record<RankingFilters["sort"], string> = {
  rank: "global_rank",
  score: "index_score",
  name: "name",
  abv: "abv",
  country: "country_name",
  style: "style_name",
};

export async function listBeers(filters: RankingFilters, allRows = false) {
  let query = getPublicClient().from("beer_catalog").select("*", { count: "exact" });
  const search = sanitizeSearchTerm(filters.q);
  if (search) {
    query = query.or(
      `name.ilike.%${search}%,brewery_name.ilike.%${search}%,country_name.ilike.%${search}%,style_name.ilike.%${search}%`,
    );
  }
  if (filters.country) query = query.eq("country_slug", filters.country);
  if (filters.style) query = query.eq("style_slug", filters.style);
  if (filters.minScore > 0) query = query.gte("index_score", filters.minScore);
  query = query.order(sortColumns[filters.sort], {
    ascending: filters.direction === "asc",
    nullsFirst: false,
  });
  if (filters.sort !== "rank") query = query.order("global_rank", { ascending: true });
  if (!allRows) {
    const from = (filters.page - 1) * PAGE_SIZE;
    query = query.range(from, from + PAGE_SIZE - 1);
  }
  const { data, error, count } = await query;
  assertNoError(error, "The beer ranking could not be loaded.");
  return { beers: (data ?? []) as BeerCatalogRow[], count: count ?? 0 };
}

export async function listBeerOptions() {
  const { data, error } = await getPublicClient()
    .from("beer_catalog")
    .select("id,name,slug,brewery_name,country_name,style_name")
    .order("name");
  assertNoError(error, "Beer choices could not be loaded.");
  return (data ?? []) as Pick<BeerCatalogRow, "id" | "name" | "slug" | "brewery_name" | "country_name" | "style_name">[];
}

export async function getBeerBySlug(slug: string) {
  const { data, error } = await getPublicClient()
    .from("beer_catalog")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  assertNoError(error, "The beer could not be loaded.");
  return data as BeerCatalogRow | null;
}

export async function getBeerDescriptors(beerId: number) {
  const { data: links, error: linkError } = await getPublicClient()
    .from("beer_descriptors")
    .select("intensity,descriptor_id")
    .eq("beer_id", beerId)
    .order("intensity", { ascending: false });
  assertNoError(linkError, "Beer descriptors could not be loaded.");
  if (!links?.length) return [];
  const { data: descriptors, error: descriptorError } = await getPublicClient()
    .from("descriptors")
    .select("id,name,category")
    .in("id", links.map((link) => link.descriptor_id));
  assertNoError(descriptorError, "Beer descriptors could not be loaded.");
  const descriptorMap = new Map((descriptors ?? []).map((descriptor) => [descriptor.id, descriptor]));
  return links.flatMap((link) => {
    const descriptor = descriptorMap.get(link.descriptor_id);
    return descriptor ? [{ name: descriptor.name, category: descriptor.category, intensity: link.intensity }] : [];
  }) as BeerDescriptor[];
}

export async function listCountries() {
  const { data, error } = await getPublicClient()
    .from("country_summaries")
    .select("*")
    .order("average_score", { ascending: false, nullsFirst: false });
  assertNoError(error, "Country summaries could not be loaded.");
  return (data ?? []) as CountrySummaryRow[];
}

export async function getCountry(slug: string) {
  const { data, error } = await getPublicClient()
    .from("country_summaries")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  assertNoError(error, "The country could not be loaded.");
  return data as CountrySummaryRow | null;
}

export async function listCountryBeers(slug: string) {
  const { data, error } = await getPublicClient()
    .from("beer_catalog")
    .select("*")
    .eq("country_slug", slug)
    .order("index_score", { ascending: false });
  assertNoError(error, "The country ranking could not be loaded.");
  return (data ?? []) as BeerCatalogRow[];
}

export async function listStyles() {
  const { data, error } = await getPublicClient()
    .from("style_summaries")
    .select("*")
    .order("family")
    .order("name");
  assertNoError(error, "Style summaries could not be loaded.");
  return (data ?? []) as StyleSummaryRow[];
}

export async function getStyle(slug: string) {
  const { data, error } = await getPublicClient()
    .from("style_summaries")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  assertNoError(error, "The style could not be loaded.");
  return data as StyleSummaryRow | null;
}

export async function listStyleBeers(slug: string) {
  const { data, error } = await getPublicClient()
    .from("beer_catalog")
    .select("*")
    .eq("style_slug", slug)
    .order("index_score", { ascending: false });
  assertNoError(error, "The style examples could not be loaded.");
  return (data ?? []) as BeerCatalogRow[];
}

export async function getCatalogStats() {
  const [{ count: beerCount, error: beerError }, countries, { data: scores, error: scoreError }, { data: breweries, error: breweryError }] =
    await Promise.all([
      getPublicClient().from("beers").select("id", { count: "exact", head: true }),
      listCountries(),
      getPublicClient().from("beer_assessments").select("index_score"),
      getPublicClient().from("breweries").select("id"),
    ]);
  assertNoError(beerError, "Beer counts could not be loaded.");
  assertNoError(scoreError, "Score aggregates could not be loaded.");
  assertNoError(breweryError, "Brewery counts could not be loaded.");
  const scoreValues = (scores ?? [])
    .map((row) => row.index_score)
    .filter((score): score is number => score !== null);
  const mean = scoreValues.length
    ? scoreValues.reduce((sum, value) => sum + value, 0) / scoreValues.length
    : 0;
  return {
    beerCount: beerCount ?? 0,
    countryCount: countries.filter((country) => country.beer_count > 0).length,
    breweryCount: breweries?.length ?? 0,
    meanScore: mean,
  };
}

export async function getBeersByIds(ids: number[]) {
  if (!ids.length) return [];
  const { data, error } = await getPublicClient()
    .from("beer_catalog")
    .select("*")
    .in("id", ids);
  assertNoError(error, "Saved beers could not be loaded.");
  const order = new Map(ids.map((id, index) => [id, index]));
  const beers = (data ?? []) as BeerCatalogRow[];
  return beers.toSorted((left, right) => (order.get(left.id) ?? 0) - (order.get(right.id) ?? 0));
}
