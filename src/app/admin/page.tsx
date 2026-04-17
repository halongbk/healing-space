import { createClient } from "@/lib/supabase/server";
import { FileText, Users, Activity, Sparkles } from "lucide-react";

export const revalidate = 0; // Luôn fetch mới trên Admin

export default async function AdminDashboardPage() {
  const supabase = createClient();

  // 1. Tổng số contents
  const { count: contentCount } = await supabase
    .from("contents")
    .select("*", { count: "exact", head: true });

  // 2. Tổng số users
  const { count: userCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  // 3. Tổng số sessions hôm nay
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { count: sessionCount } = await supabase
    .from("user_sessions")
    .select("*", { count: "exact", head: true })
    .gte("created_at", today.toISOString());

  // 4. Phòng sử dụng nhiều nhất (7 ngày qua)
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  const { data: recentSessions } = await supabase
    .from("user_sessions")
    .select("room")
    .gte("created_at", lastWeek.toISOString());

  let topRoom = "Chưa có dữ liệu";
  if (recentSessions && recentSessions.length > 0) {
    const roomCounts = recentSessions.reduce((acc, curr) => {
      acc[curr.room] = (acc[curr.room] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    topRoom = Object.entries(roomCounts).sort((a, b) => b[1] - a[1])[0][0];
    topRoom = topRoom.charAt(0).toUpperCase() + topRoom.slice(1);
  }

  // Lấy 5 nội dung mới nhất
  const { data: latestContents } = await supabase
    .from("contents")
    .select("id, title, target_mood, content_type, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    { label: "Nội dung đang Active", value: contentCount || 0, icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Người dùng đăng ký", value: userCount || 0, icon: Users, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Sessions hôm nay", value: sessionCount || 0, icon: Activity, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Phòng chuộng nhất (7N)", value: topRoom, icon: Sparkles, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-serif text-ink mb-1">Dashboard</h1>
        <p className="text-muted text-[15px]">Tổng quan hoạt động của Healing Space</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-cream-3 rounded-2xl p-5 shadow-sm flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <div>
              <p className="text-[13px] text-muted font-medium mb-1">{stat.label}</p>
              <h3 className="text-2xl font-semibold text-ink">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Latest Contents */}
      <div className="bg-white border border-cream-3 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-cream-3 flex items-center justify-between">
          <h2 className="text-lg font-medium text-ink font-serif">Nội dung mới thêm</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-[#FAFAF9] text-hint border-b border-cream-3">
              <tr>
                <th className="px-6 py-3 font-medium">Tiêu đề</th>
                <th className="px-6 py-3 font-medium">Loại</th>
                <th className="px-6 py-3 font-medium">Tâm trạng đích</th>
                <th className="px-6 py-3 font-medium">Ngày tạo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-3">
              {latestContents?.map((item) => (
                <tr key={item.id} className="hover:bg-[#FCFCFC]">
                  <td className="px-6 py-4 text-ink font-medium max-w-[200px] truncate" title={item.title}>
                    {item.title}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-cream-2 text-muted text-[12px] font-medium uppercase tracking-wide">
                      {item.content_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted capitalize">{item.target_mood}</td>
                  <td className="px-6 py-4 text-hint text-[13px]">
                    {new Date(item.created_at).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))}
              {(!latestContents || latestContents.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted">
                    Chưa có nội dung nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
