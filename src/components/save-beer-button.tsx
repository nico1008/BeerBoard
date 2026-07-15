"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toggleSavedBeer } from "@/app/actions/saved";
import { createClient } from "@/lib/supabase/client";

export function SaveBeerButton({ beerId, beerSlug, initialSaved = false }: { beerId: number; beerSlug: string; initialSaved?: boolean }) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [checkingSaved, setCheckingSaved] = useState(!initialSaved);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (initialSaved) return;
    const supabase = createClient();
    let mounted = true;
    void supabase.auth.getUser().then(async ({ data, error: userError }) => {
      if (!mounted) return;
      if (userError) {
        setMessage("Your saved beers could not be checked. Please refresh and try again.");
        setCheckingSaved(false);
        return;
      }
      if (!data.user) {
        setCheckingSaved(false);
        return;
      }
      const { data: entry, error } = await supabase
        .from("ledger_entries")
        .select("beer_id")
        .eq("user_id", data.user.id)
        .eq("beer_id", beerId)
        .maybeSingle();
      if (!mounted) return;
      if (error) setMessage("Your saved beers could not be checked. Please refresh and try again.");
      else setSaved(Boolean(entry));
      setCheckingSaved(false);
    });
    return () => { mounted = false; };
  }, [beerId, initialSaved]);

  function toggle() {
    startTransition(async () => {
      const result = await toggleSavedBeer(beerId);
      if (result.status === "auth_required") {
        router.push(`/login?next=${encodeURIComponent(`/beers/${beerSlug}`)}&reason=saved`);
        return;
      }
      if (result.status === "error") {
        setMessage(result.message);
        return;
      }
      const nextSaved = result.status === "saved";
      setSaved(nextSaved);
      setMessage(nextSaved ? "Beer saved." : "Beer removed from your saved beers.");
    });
  }

  return (
    <>
      <button className="button-secondary" type="button" onClick={toggle} disabled={pending || checkingSaved}>
        {saved ? <BookmarkCheck aria-hidden="true" size={17} /> : <Bookmark aria-hidden="true" size={17} />}
        {checkingSaved ? "Checking…" : pending ? "Updating…" : saved ? "Saved" : "Save beer"}
      </button>
      <span className="sr-only" aria-live="polite">{message}</span>
    </>
  );
}
