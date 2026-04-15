import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Trang chủ — redirect dựa trên trạng thái auth
 * - Đã đăng nhập → /rooms
 * - Chưa đăng nhập → /login
 */
export default async function HomePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/rooms");
  } else {
    redirect("/login");
  }
}
