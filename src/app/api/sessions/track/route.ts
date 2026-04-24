import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const supabase = createClient();

  // Lấy user từ session (bảo mật)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { room, mood, content_id, duration_seconds } = body;

    if (!room) {
      return NextResponse.json({ error: "Thiếu trường room" }, { status: 400 });
    }

    const { error } = await supabase.from("user_sessions").insert({
      user_id: user.id,
      room,
      mood: mood || null,
      content_id: content_id || null,
      duration_seconds: duration_seconds || 0,
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/sessions/track] error:", err);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
