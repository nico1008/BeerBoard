import type { Metadata } from "next";
import { ArrowUpRight, Bookmark } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SaveBeerButton } from "@/components/save-beer-button";
import { getBeersByIds } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Saved beers" };
export const dynamic = "force-dynamic";

export default async function SavedBeersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/saved");

  const { data: entries, error } = await supabase
    .from("ledger_entries")
    .select("beer_id,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw new Error("Your saved beers could not be loaded.");
  const beers = await getBeersByIds((entries ?? []).map((entry) => entry.beer_id));

  return (
    <div className="container page saved-page">
      <header className="saved-header"><Bookmark aria-hidden="true" /><h1>Saved beers</h1><p>Beers you liked or want to find again.</p></header>
      {beers.length ? <ol className="saved-list" aria-label="Saved beers">{beers.map((beer, index) => <li key={beer.id}><span>{String(index + 1).padStart(2, "0")}</span><div><h2><Link href={`/beers/${beer.slug}`}>{beer.name}<ArrowUpRight aria-hidden="true" size={18} /></Link></h2><p>{beer.brewery_name} · {beer.country_name}</p><Link href={`/styles/${beer.style_slug}`}>{beer.style_name}</Link></div><strong>{beer.index_score.toFixed(1)}</strong><SaveBeerButton beerId={beer.id} beerSlug={beer.slug} initialSaved /></li>)}</ol>
        : <div className="empty-state section"><h2>No saved beers yet</h2><p>Save any beer you liked or want to remember.</p><Link className="button-secondary" href="/beers">Find a beer</Link></div>}
    </div>
  );
}
