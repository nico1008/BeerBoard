"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getSiteUrl, safeReturnPath } from "@/lib/site-url";
import { createClient } from "@/lib/supabase/server";

const emailSchema = z.string().trim().email().max(254);
const passwordSchema = z.string().min(8).max(128);
const displayNameSchema = z.string().trim().min(1).max(60);

function authRedirect(path: string, kind: "error" | "success", message: string, extra?: Record<string, string>): never {
  const params = new URLSearchParams({ [kind]: message, ...extra });
  redirect(`${path}?${params}`);
}

export async function signIn(formData: FormData) {
  const parsed = z.object({ email: emailSchema, password: passwordSchema }).safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const next = safeReturnPath(formData.get("next"));
  if (!parsed.success) authRedirect("/login", "error", "Enter a valid email and a password of at least 8 characters.", { next });
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) authRedirect("/login", "error", "The email or password was not accepted.", { next });
  redirect(next);
}

export async function signUp(formData: FormData) {
  const parsed = z.object({ email: emailSchema, password: passwordSchema, displayName: displayNameSchema }).safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    displayName: formData.get("displayName"),
  });
  const next = safeReturnPath(formData.get("next"));
  if (!parsed.success) authRedirect("/signup", "error", "Use a valid email, a display name, and a password of at least 8 characters.", { next });
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { display_name: parsed.data.displayName },
      emailRedirectTo: `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });
  if (error) authRedirect("/signup", "error", error.message, { next });
  if (data.session) redirect(next);
  authRedirect("/login", "success", "Check your email to confirm your account.", { next });
}

export async function requestPasswordReset(formData: FormData) {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) authRedirect("/forgot-password", "error", "Enter a valid email address.");
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${getSiteUrl()}/auth/callback?next=/reset-password`,
  });
  if (error) authRedirect("/forgot-password", "error", "The reset email could not be sent. Please try again.");
  authRedirect("/forgot-password", "success", "If an account exists for that email, a reset link is on its way.");
}

export async function updatePassword(formData: FormData) {
  const parsed = z.object({ password: passwordSchema, confirmation: passwordSchema }).safeParse({
    password: formData.get("password"),
    confirmation: formData.get("confirmation"),
  });
  if (!parsed.success || parsed.data.password !== parsed.data.confirmation) {
    authRedirect("/reset-password", "error", "Use matching passwords of at least 8 characters.");
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?error=Open+the+password+reset+link+from+your+email.");
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) authRedirect("/reset-password", "error", "The password could not be updated. Request a new reset link.");
  authRedirect("/login", "success", "Password updated. You can now log in.");
}
