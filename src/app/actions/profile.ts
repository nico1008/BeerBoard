"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const profileSchema = z.object({
  displayName: z.string().trim().min(1).max(60),
  theme: z.enum(["light", "dark", "system"]),
});

export async function updateProfile(formData: FormData) {
  const parsed = profileSchema.safeParse({ displayName: formData.get("displayName"), theme: formData.get("theme") });
  if (!parsed.success) redirect("/settings?error=Use+a+display+name+between+1+and+60+characters.");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/settings");
  const { error } = await supabase
    .from("profiles")
    .update({ display_name: parsed.data.displayName, theme: parsed.data.theme })
    .eq("id", user.id);
  if (error) redirect("/settings?error=Your+settings+could+not+be+saved.");
  await supabase.auth.updateUser({ data: { display_name: parsed.data.displayName } });
  revalidatePath("/settings");
  redirect("/settings?success=Settings+saved.");
}
