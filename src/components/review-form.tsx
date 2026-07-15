"use client";

import { Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { removeReview, submitReview } from "@/app/actions/reviews";
import { createClient } from "@/lib/supabase/client";

export function ReviewForm({ beerId, beerSlug, beerName }: { beerId: number; beerSlug: string; beerName: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [hasReview, setHasReview] = useState(false);
  const [checkingReview, setCheckingReview] = useState(true);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;
    void supabase.auth.getUser().then(async ({ data, error: userError }) => {
      if (!mounted) return;
      if (userError) {
        setMessage("Your account state could not be checked. Please refresh and try again.");
        setCheckingReview(false);
        return;
      }
      if (!data.user) {
        setCheckingReview(false);
        return;
      }
      const { data: review, error } = await supabase
        .from("reviews")
        .select("rating,body")
        .eq("user_id", data.user.id)
        .eq("beer_id", beerId)
        .maybeSingle();
      if (!mounted) return;
      if (error) {
        setMessage("Your existing review could not be loaded. Please refresh and try again.");
      } else if (review) {
        setRating(review.rating);
        setBody(review.body);
        setHasReview(true);
      }
      setCheckingReview(false);
    });
    return () => { mounted = false; };
  }, [beerId]);

  function publish() {
    setMessage("");
    startTransition(async () => {
      const result = await submitReview({ beerId, beerSlug, rating, body });
      if (result.status === "auth_required") {
        router.push(`/login?next=${encodeURIComponent(`/beers/${beerSlug}#reviews`)}&reason=review`);
        return;
      }
      if (result.status === "error") {
        setMessage(result.message);
        return;
      }
      setHasReview(true);
      setMessage("Your review is published.");
      router.refresh();
    });
  }

  function remove() {
    setMessage("");
    startTransition(async () => {
      const result = await removeReview({ beerId, beerSlug });
      if (result.status === "auth_required") {
        router.push(`/login?next=${encodeURIComponent(`/beers/${beerSlug}#reviews`)}&reason=review`);
        return;
      }
      if (result.status === "error") {
        setMessage(result.message);
        return;
      }
      setRating(0);
      setBody("");
      setHasReview(false);
      setMessage("Your review was removed.");
      router.refresh();
    });
  }

  return (
    <form className="review-form" action={publish}>
      <fieldset>
        <legend>Your rating for {beerName}</legend>
        <div className="rating-options">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} data-active={rating >= value}>
              <input type="radio" name="rating" value={value} checked={rating === value} onChange={() => setRating(value)} required disabled={checkingReview} />
              <Star aria-hidden="true" size={20} fill={rating >= value ? "currentColor" : "none"} />
              <span className="sr-only">{value} out of 5</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="field">
        <label htmlFor={`review-${beerId}`}>What did you notice?</label>
        <textarea className="textarea" id={`review-${beerId}`} value={body} onChange={(event) => setBody(event.target.value)} minLength={10} maxLength={1000} required disabled={checkingReview} placeholder="Share the taste, aroma, occasion, or anything another curious drinker should know." />
        <span>{body.length}/1000 characters</span>
      </div>
      <div className="review-form-actions">
        <button className="button" type="submit" disabled={pending || checkingReview}>{checkingReview ? "Checking your review…" : pending ? "Publishing…" : hasReview ? "Update review" : "Publish review"}</button>
        {hasReview ? <button className="button-ghost" type="button" onClick={remove} disabled={pending || checkingReview}><Trash2 aria-hidden="true" size={17} />Remove</button> : null}
      </div>
      {message ? <p className="form-message" role="status">{message}</p> : null}
    </form>
  );
}
