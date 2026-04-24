"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ─── Types ───────────────────────────────────────────────────────────────────
export type ContentFormData = {
  type: string;
  room: string;
  title: string;
  body?: string;
  media_url?: string;
  tags?: string[];
  group_ids?: string[];
  mood_tags?: string[];
  is_active: boolean;
  weight: number;
};

// ─── Tạo mới content ─────────────────────────────────────────────────────────
export async function createContent(data: ContentFormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Chưa đăng nhập" };

  const { error } = await supabase.from("contents").insert({
    ...data,
    created_by: user.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/contents");
  redirect("/admin/contents");
}

// ─── Cập nhật content ────────────────────────────────────────────────────────
export async function updateContent(id: string, data: ContentFormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Chưa đăng nhập" };

  const { error } = await supabase
    .from("contents")
    .update(data)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/contents");
  redirect("/admin/contents");
}

// ─── Xóa / deactivate content ─────────────────────────────────────────────────
export async function deleteContent(id: string) {
  const supabase = createClient();

  // Kiểm tra có reference trong user_sessions không
  const { count } = await supabase
    .from("user_sessions")
    .select("*", { count: "exact", head: true })
    .eq("content_id", id);

  if (count && count > 0) {
    // Đã có lịch sử → chỉ set inactive
    const { error } = await supabase
      .from("contents")
      .update({ is_active: false })
      .eq("id", id);
    if (error) return { error: error.message };
    return { softDeleted: true };
  }

  // Chưa có lịch sử → xóa hẳn
  const { error } = await supabase.from("contents").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/contents");
  return { deleted: true };
}

// ─── Upload ảnh lên Storage ───────────────────────────────────────────────────
export async function uploadImage(formData: FormData) {
  const supabase = createClient();
  const file = formData.get("file") as File;

  if (!file) return { error: "Không tìm thấy file" };
  if (file.size > 5 * 1024 * 1024) return { error: "File vượt quá 5MB" };
  if (!file.type.startsWith("image/")) return { error: "Chỉ chấp nhận file ảnh" };

  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { error } = await supabase.storage
    .from("healing-content")
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) return { error: error.message };

  const { data } = supabase.storage
    .from("healing-content")
    .getPublicUrl(fileName);

  return { url: data.publicUrl };
}
