import type { Metadata } from "next";
import { ArrowUpRight, BookMarked } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LedgerButton } from "@/components/ledger-button";
import { getBeersByIds } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "My beer ledger" };
export const dynamic = "force-dynamic";

export default async function LedgerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/ledger");
  const { data: entries, error } = await supabase.from("ledger_entries").select("beer_id,created_at").eq("user_id", user.id).order("created_at", { ascending: false });
  if (error) throw new Error("Your ledger could not be loaded.");
  const beers = await getBeersByIds((entries ?? []).map((entry) => entry.beer_id));

  return (
    <div className="container page ledger-page">
      <header className="ledger-header"><BookMarked aria-hidden="true" /><h1>Your beer ledger</h1><p>A private shelf for beers you want to revisit, compare, or simply remember.</p></header>
      {beers.length ? <ol className="ledger-list" aria-label="Saved beers">{beers.map((beer, index) => <li key={beer.id}><span>{String(index + 1).padStart(2, "0")}</span><div><h2><Link href={`/beers/${beer.slug}`}>{beer.name}<ArrowUpRight aria-hidden="true" size={18} /></Link></h2><p>{beer.brewery_name} · {beer.country_name}</p><Link href={`/styles/${beer.style_slug}`}>{beer.style_name}</Link></div><strong>{beer.index_score.toFixed(1)}</strong><LedgerButton beerId={beer.id} beerSlug={beer.slug} initialSaved /></li>)}</ol>
        : <div className="empty-state section"><h2>Your ledger is ready</h2><p>Save a beer from any profile. Your list stays private to your account.</p><Link className="button-secondary" href="/beers">Find a beer</Link></div>}
    </div>
  );
}
