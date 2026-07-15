"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const reviewSchema = z.object({
  beerId: z.number().int().positive(),
  beerSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  rating: z.number().int().min(1).max(5),
  body: z.string().trim().min(10).max(1000),
});

const removeReviewSchema = reviewSchema.pick({ beerId: true, beerSlug: true });

export type ReviewActionResult =
  | { status: "saved" }
  | { status: "removed" }
  | { status: "auth_required" }
  | { status: "error"; message: string };

export async function submitReview(input: unknown): Promise<ReviewActionResult> {
  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) return { status: "error", message: "Choose a rating and write at least 10 characters." };

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return { status: "auth_required" };

  const { data: existing, error: lookupError } = await supabase
    .from("reviews")
    .select("id")
    .eq("user_id", user.id)
    .eq("beer_id", parsed.data.beerId)
    .maybeSingle();
  if (lookupError) return { status: "error", message: "Your review could not be checked. Please try again." };

  let error: { message: string } | null;
  if (existing) {
    ({ error } = await supabase
      .from("reviews")
      .update({ rating: parsed.data.rating, body: parsed.data.body })
      .eq("user_id", user.id)
      .eq("beer_id", parsed.data.beerId));
  } else {
    ({ error } = await supabase.from("reviews").insert({
      user_id: user.id,
      beer_id: parsed.data.beerId,
      rating: parsed.data.rating,
      body: parsed.data.body,
    }));
  }

  if (error) return { status: "error", message: "Your review could not be published. Please try again." };
  revalidatePath(`/beers/${parsed.data.beerSlug}`);
  revalidatePath("/reviews");
  return { status: "saved" };
}

export async function removeReview(input: unknown): Promise<ReviewActionResult> {
  const parsed = removeReviewSchema.safeParse(input);
  if (!parsed.success) return { status: "error", message: "That review could not be identified." };

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return { status: "auth_required" };

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("user_id", user.id)
    .eq("beer_id", parsed.data.beerId);
  if (error) return { status: "error", message: "Your review could not be removed. Please try again." };

  revalidatePath(`/beers/${parsed.data.beerSlug}`);
  revalidatePath("/reviews");
  return { status: "removed" };
}
