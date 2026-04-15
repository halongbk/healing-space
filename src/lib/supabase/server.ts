import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase Server Client
 * Dùng trong Server Component, Route Handler, Server Action
 *
 * Cách dùng:
 *   import { createClient } from "@/lib/supabase/server";
 *   const supabase = createClient();
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Cookie set trong Server Component sẽ bị lỗi
            // Có thể bỏ qua nếu đang trong middleware refresh session
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // Tương tự như trên
          }
        },
      },
    }
  );
}
