import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database.types";

let publicClient: SupabaseClient<Database> | undefined;

export function getPublicClient() {
  if (!publicClient) {
    const { url, publishableKey } = getSupabaseConfig();
    publicClient = createClient<Database>(url, publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  }

  return publicClient;
}
