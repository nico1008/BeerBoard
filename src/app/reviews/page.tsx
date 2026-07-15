import type { Metadata } from "next";
import { MessageSquareText, Star } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getBeersByIds } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "My reviews" };
export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/reviews");

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("id,beer_id,rating,body,updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });
  if (error) throw new Error("Your reviews could not be loaded.");

  const beers = await getBeersByIds((reviews ?? []).map((review) => review.beer_id));
  const beerById = new Map(beers.map((beer) => [beer.id, beer]));

  return (
    <div className="container page reviews-page">
      <header className="saved-header"><MessageSquareText aria-hidden="true" /><h1>Your reviews</h1><p>Your take on the beers you have tried.</p></header>
      {reviews?.length ? <div className="account-review-list">{reviews.map((review) => {
        const beer = beerById.get(review.beer_id);
        if (!beer) return null;
        return <article key={review.id}><div><p className="review-rating"><Star aria-hidden="true" size={17} fill="currentColor" />{review.rating} out of 5</p><h2><Link href={`/beers/${beer.slug}#reviews`}>{beer.name}</Link></h2><p>{beer.brewery_name} · {beer.country_name}</p></div><blockquote>{review.body}</blockquote><Link className="text-link" href={`/beers/${beer.slug}#reviews`}>Edit review</Link></article>;
      })}</div> : <div className="empty-state section"><h2>No reviews yet</h2><p>Try a beer, then tell other curious drinkers what you noticed.</p><Link className="button" href="/beers">Find a beer to review</Link></div>}
    </div>
  );
}
