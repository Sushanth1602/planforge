import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://sample-planforge.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sample-anon-key"
  );
}
