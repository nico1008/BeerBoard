import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LedgerButton } from "@/components/ledger-button";
import { getBeersByIds } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Your Ledger" };
export const dynamic = "force-dynamic";

export default async function LedgerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/ledger");
  const { data: entries, error } = await supabase
    .from("ledger_entries")
    .select("beer_id,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw new Error("Your Ledger could not be loaded.");
  const beers = await getBeersByIds((entries ?? []).map((entry) => entry.beer_id));

  return (
    <div className="container page">
      <header className="page-header"><div><h1>Your Ledger</h1><p>A private list of demonstration beers you want to revisit or compare.</p></div></header>
      {beers.length ? (
        <section className="section catalog-list" aria-label="Saved beers">
          {beers.map((beer) => (
            <article className="catalog-row" key={beer.id}>
              <div><h2><Link href={`/beers/${beer.slug}`}>{beer.name}</Link></h2><p>{beer.brewery_name} · {beer.country_name}</p></div>
              <div><span className="table-label">Style</span><div><Link href={`/styles/${beer.style_slug}`}>{beer.style_name}</Link></div></div>
              <div><span className="table-label">Index</span><div className="catalog-value">{beer.index_score.toFixed(1)}</div></div>
              <div><LedgerButton beerId={beer.id} beerSlug={beer.slug} initialSaved /></div>
            </article>
          ))}
        </section>
      ) : (
        <div className="empty-state section"><h2>Your Ledger is ready</h2><p>Save a beer from any detail page. Your entries are private and protected by database ownership policies.</p><Link className="button-secondary" href="/beers">Find a beer</Link></div>
      )}
    </div>
  );
}
