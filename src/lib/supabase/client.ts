import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "./env";

/** Supabase client สำหรับ Client Component */
export function createClient() {
  const { url, anonKey } = getSupabaseConfig();
  return createBrowserClient(url, anonKey);
}
