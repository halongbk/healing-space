import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase Browser Client
 * Dùng trong các Client Component (có "use client")
 *
 * Cách dùng:
 *   import { createClient } from "@/lib/supabase/client";
 *   const supabase = createClient();
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
