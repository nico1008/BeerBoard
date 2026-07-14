import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { filtersToSearchParams, PAGE_SIZE, type RankingFilters } from "@/lib/ranking";

export function Pagination({ filters, count }: { filters: RankingFilters; count: number }) {
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  if (totalPages <= 1) return null;
  const previous = filtersToSearchParams({ ...filters, page: Math.max(1, filters.page - 1) });
  const next = filtersToSearchParams({ ...filters, page: Math.min(totalPages, filters.page + 1) });

  return (
    <nav className="pagination" aria-label="Ranking pages">
      {filters.page > 1 ? <Link className="button-ghost" href={`/beers?${previous}`}><ArrowLeft size={16} />Previous</Link> : null}
      <span>Page {filters.page} of {totalPages}</span>
      {filters.page < totalPages ? <Link className="button-ghost" href={`/beers?${next}`}>Next<ArrowRight size={16} /></Link> : null}
    </nav>
  );
}
