"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toggleLedger } from "@/app/actions/ledger";

export function LedgerButton({ beerId, beerSlug, initialSaved = false }: { beerId: number; beerSlug: string; initialSaved?: boolean }) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      const result = await toggleLedger(beerId);
      if (result.status === "auth_required") {
        router.push(`/login?next=${encodeURIComponent(`/beers/${beerSlug}`)}&reason=ledger`);
        return;
      }
      if (result.status === "error") {
        setMessage(result.message);
        return;
      }
      const nextSaved = result.status === "saved";
      setSaved(nextSaved);
      setMessage(nextSaved ? "Saved to your Ledger." : "Removed from your Ledger.");
    });
  }

  return (
    <>
      <button className={saved ? "button-secondary" : "button"} type="button" onClick={toggle} disabled={pending}>
        {saved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
        {pending ? "Updating…" : saved ? "Saved to Ledger" : "Add to Ledger"}
      </button>
      <span className="sr-only" aria-live="polite">{message}</span>
    </>
  );
}
