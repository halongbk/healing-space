import { createClient } from "@/lib/supabase/server";
import { weightedRandom } from "@/lib/weighted-random";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const room = searchParams.get("room");
  const mood = searchParams.get("mood");

  // Validate: room bắt buộc
  if (!room) {
    return NextResponse.json({ error: "Thiếu tham số room" }, { status: 400 });
  }

  const supabase = createClient();

  // Lấy session user hiện tại (bảo mật: không nhận user_id từ client)
  const { data: { user } } = await supabase.auth.getUser();

  try {
    // ─── BƯỚC 1 & 2: Lọc active + đúng room ───────────────────────────────────
    const { data: allContents, error: fetchError } = await supabase
      .from("contents")
      .select("*")
      .eq("is_active", true)
      .or(`room.eq.${room},room.eq.all`);

    if (fetchError) throw fetchError;
    if (!allContents || allContents.length === 0) {
      return NextResponse.json({ content: null, reason: "no_content" });
    }

    // ─── BƯỚC 3: Lọc group_ids ────────────────────────────────────────────────
    let filtered = allContents;

    if (user) {
      const { data: userProfile } = await supabase
        .from("users")
        .select("group_id")
        .eq("id", user.id)
        .single();

      const userGroupId = userProfile?.group_id;

      filtered = allContents.filter((c) => {
        // group_ids rỗng = hiện cho tất cả
        if (!c.group_ids || c.group_ids.length === 0) return true;
        // Nếu user không thuộc nhóm nào → hiện content không giới hạn nhóm
        if (!userGroupId) return c.group_ids.length === 0;
        // Kiểm tra user thuộc nhóm content này
        return c.group_ids.includes(userGroupId);
      });
    }

    if (filtered.length === 0) filtered = allContents; // fallback nếu lọc nhóm quá chặt

    // ─── BƯỚC 4: Lọc mood_tags ────────────────────────────────────────────────
    let moodFiltered = filtered;

    if (mood && mood.trim()) {
      const moodMatched = filtered.filter((c) => {
        if (!c.mood_tags || c.mood_tags.length === 0) return true; // không tag mood = hiện cho tất cả
        return c.mood_tags.some(
          (tag: string) => tag.toLowerCase() === mood.toLowerCase()
        );
      });
      // Chỉ áp dụng nếu có ít nhất 1 kết quả
      if (moodMatched.length > 0) moodFiltered = moodMatched;
    }

    // ─── BƯỚC 5: Ưu tiên content chưa xem trong 7 ngày ───────────────────────
    let candidates = moodFiltered;

    if (user) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: recentSessions } = await supabase
        .from("user_sessions")
        .select("content_id")
        .eq("user_id", user.id)
        .eq("room", room)
        .gte("created_at", sevenDaysAgo.toISOString())
        .not("content_id", "is", null);

      const recentContentIds = new Set(
        (recentSessions || []).map((s: { content_id: string }) => s.content_id)
      );

      const unseen = moodFiltered.filter((c) => !recentContentIds.has(c.id));

      // Nếu còn >= 3 content chưa xem → ưu tiên chúng
      // Nếu ít hơn → nới lỏng, dùng toàn bộ moodFiltered
      if (unseen.length >= 1) {
        candidates = unseen;
      }
      // Nếu đã xem hết → candidates giữ nguyên moodFiltered (cho phép xem lại)
    }

    // ─── CHỌN NGẪU NHIÊN CÓ TRỌNG SỐ ────────────────────────────────────────
    const selected = weightedRandom(candidates);

    if (!selected) {
      // Ultimate fallback: bất kỳ content active nào của room
      const fallback = weightedRandom(allContents);
      return NextResponse.json({
        content: fallback,
        reason: "fallback_all",
      });
    }

    return NextResponse.json({
      content: selected,
      reason: "ok",
      pool_size: candidates.length,
    });
  } catch (err) {
    console.error("[/api/content/random] error:", err);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
