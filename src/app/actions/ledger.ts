"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const beerIdSchema = z.number().int().positive();

export type LedgerActionResult =
  | { status: "saved" }
  | { status: "removed" }
  | { status: "auth_required" }
  | { status: "error"; message: string };

export async function toggleLedger(beerIdInput: number): Promise<LedgerActionResult> {
  const parsed = beerIdSchema.safeParse(beerIdInput);
  if (!parsed.success) return { status: "error", message: "That beer could not be identified." };

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return { status: "auth_required" };

  const { data: existing, error: lookupError } = await supabase
    .from("ledger_entries")
    .select("beer_id")
    .eq("user_id", user.id)
    .eq("beer_id", parsed.data)
    .maybeSingle();
  if (lookupError) return { status: "error", message: "Your Ledger could not be checked." };

  if (existing) {
    const { error } = await supabase
      .from("ledger_entries")
      .delete()
      .eq("user_id", user.id)
      .eq("beer_id", parsed.data);
    if (error) return { status: "error", message: "The beer could not be removed from your Ledger." };
    revalidatePath("/ledger");
    return { status: "removed" };
  }

  const { error } = await supabase.from("ledger_entries").insert({ user_id: user.id, beer_id: parsed.data });
  if (error) return { status: "error", message: "The beer could not be saved to your Ledger." };
  revalidatePath("/ledger");
  return { status: "saved" };
}
