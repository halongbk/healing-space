"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Dịch Supabase Auth error → thông báo tiếng Việt thân thiện
 */
function translateError(error: { message: string; status?: number }): string {
  const msg = error.message.toLowerCase();

  if (msg.includes("invalid login credentials"))
    return "Email hoặc mật khẩu không chính xác.";
  if (msg.includes("email not confirmed"))
    return "Email chưa được xác nhận. Vui lòng kiểm tra hộp thư.";
  if (msg.includes("already registered") || msg.includes("already been registered"))
    return "Email này đã được đăng ký. Hãy thử đăng nhập.";
  if (msg.includes("password") && msg.includes("at least"))
    return "Mật khẩu phải có ít nhất 6 ký tự.";
  if (msg.includes("rate limit") || msg.includes("too many requests"))
    return "Bạn đã thử quá nhiều lần. Vui lòng đợi 1 phút rồi thử lại.";
  if (msg.includes("email") && msg.includes("invalid"))
    return "Định dạng email không hợp lệ.";
  if (msg.includes("signup is disabled"))
    return "Tính năng đăng ký tạm thời bị tắt.";
  if (msg.includes("user not found"))
    return "Không tìm thấy tài khoản với email này.";

  return `Đã có lỗi xảy ra: ${error.message}`;
}

export async function login(formData: FormData) {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: translateError(error) };
  }

  revalidatePath("/rooms");
  redirect("/rooms");
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const displayName = formData.get("display_name") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName || email.split("@")[0],
      },
    },
  });

  if (error) {
    return { error: translateError(error) };
  }

  // Trả về success — trang register sẽ hiện thông báo kiểm tra email
  return { success: true };
}

export async function signout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
