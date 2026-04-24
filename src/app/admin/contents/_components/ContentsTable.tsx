"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Pencil, Trash2, Search, ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react";
import { deleteContent } from "../actions";

type Content = {
  id: string;
  type: string;
  room: string;
  title: string;
  weight: number;
  is_active: boolean;
  group_ids: string[];
  mood_tags: string[];
  created_at: string;
};

const TYPE_LABELS: Record<string, string> = {
  story: "Câu chuyện", image: "Ảnh", video: "Video",
  minigame: "Minigame", affirmation: "Khẳng định", quote: "Trích dẫn",
};
const ROOM_LABELS: Record<string, string> = {
  breathe: "Thở", still: "Tĩnh lặng", feel: "Cảm xúc",
  create: "Sáng tạo", recharge: "Nạp năng lượng", mystery: "Túi mù", all: "Tất cả",
};
const TYPE_COLORS: Record<string, string> = {
  story: "bg-blue-50 text-blue-600", image: "bg-violet-50 text-violet-600",
  video: "bg-red-50 text-red-600", minigame: "bg-orange-50 text-orange-600",
  affirmation: "bg-emerald-50 text-emerald-600", quote: "bg-amber-50 text-amber-600",
};

export default function ContentsTable({
  contents, totalPages, currentPage, searchParams,
}: {
  contents: Content[];
  totalPages: number;
  currentPage: number;
  searchParams: Record<string, string | undefined>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(sp.toString());
    if (value) params.set(key, value); else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setConfirmId(null);
    startTransition(async () => {
      const res = await deleteContent(id);
      setDeletingId(null);
      if (res?.error) {
        setToast({ msg: `Lỗi: ${res.error}`, ok: false });
      } else if (res?.softDeleted) {
        setToast({ msg: "Đã ẩn nội dung (có trong lịch sử)", ok: true });
        router.refresh();
      } else {
        setToast({ msg: "Đã xóa thành công", ok: true });
        router.refresh();
      }
      setTimeout(() => setToast(null), 3000);
    });
  };

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toast.ok ? "bg-moss" : "bg-rose"}`}>
          {toast.ok ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmId && (
        <div className="fixed inset-0 bg-ink/20 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-ink mb-2">Xóa nội dung?</h3>
            <p className="text-muted text-sm mb-6">Hành động này không thể hoàn tác. Nếu nội dung đã có trong lịch sử sử dụng, nó chỉ bị ẩn đi.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmId(null)} className="flex-1 px-4 py-2 border border-cream-3 rounded-full text-sm text-muted hover:bg-cream-2 transition-all">
                Hủy
              </button>
              <button
                onClick={() => handleDelete(confirmId)}
                className="flex-1 px-4 py-2 bg-rose text-white rounded-full text-sm hover:bg-rose/90 transition-all"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-cream-3 rounded-2xl p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-hint" />
          <input
            placeholder="Tìm theo tiêu đề..."
            defaultValue={searchParams.q}
            onChange={(e) => updateParam("q", e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-cream-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-moss/30"
          />
        </div>
        <select
          defaultValue={searchParams.type || ""}
          onChange={(e) => updateParam("type", e.target.value)}
          className="px-3 py-2 border border-cream-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-moss/30 bg-white"
        >
          <option value="">Tất cả loại</option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select
          defaultValue={searchParams.room || ""}
          onChange={(e) => updateParam("room", e.target.value)}
          className="px-3 py-2 border border-cream-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-moss/30 bg-white"
        >
          <option value="">Tất cả phòng</option>
          {Object.entries(ROOM_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select
          defaultValue={searchParams.status || ""}
          onChange={(e) => updateParam("status", e.target.value)}
          className="px-3 py-2 border border-cream-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-moss/30 bg-white"
        >
          <option value="">Trạng thái</option>
          <option value="active">Đang bật</option>
          <option value="inactive">Đã tắt</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-cream-3 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#FAFAF9] text-hint border-b border-cream-3">
              <tr>
                <th className="px-5 py-3 font-medium">Tiêu đề</th>
                <th className="px-5 py-3 font-medium">Loại</th>
                <th className="px-5 py-3 font-medium">Phòng</th>
                <th className="px-5 py-3 font-medium text-center">Weight</th>
                <th className="px-5 py-3 font-medium text-center">Trạng thái</th>
                <th className="px-5 py-3 font-medium">Ngày tạo</th>
                <th className="px-5 py-3 font-medium text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-3">
              {contents.map((item) => (
                <tr key={item.id} className={`hover:bg-[#FCFAF8] ${!item.is_active ? "opacity-50" : ""}`}>
                  <td className="px-5 py-3 text-ink font-medium max-w-[220px]">
                    <span className="truncate block" title={item.title}>{item.title}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${TYPE_COLORS[item.type] || "bg-cream-2 text-muted"}`}>
                      {TYPE_LABELS[item.type] || item.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted">{ROOM_LABELS[item.room] || item.room}</td>
                  <td className="px-5 py-3 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <div className="w-16 h-1.5 bg-cream-3 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-moss rounded-full"
                          style={{ width: `${(item.weight / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-ink font-medium">{item.weight}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${item.is_active ? "bg-emerald-50 text-emerald-600" : "bg-cream-2 text-hint"}`}>
                      {item.is_active ? "● Bật" : "○ Tắt"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-hint">{new Date(item.created_at).toLocaleDateString("vi-VN")}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/admin/contents/${item.id}/edit`}
                        className="p-1.5 text-muted hover:text-moss hover:bg-moss-light rounded-lg transition-all"
                        title="Sửa"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => setConfirmId(item.id)}
                        disabled={deletingId === item.id || isPending}
                        className="p-1.5 text-muted hover:text-rose hover:bg-rose/10 rounded-lg transition-all disabled:opacity-40"
                        title="Xóa"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {contents.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-muted">
                    Không tìm thấy nội dung nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-cream-3 flex items-center justify-between">
            <span className="text-xs text-hint">Trang {currentPage}/{totalPages}</span>
            <div className="flex gap-2">
              <Link
                href={`?${new URLSearchParams({ ...searchParams, page: String(currentPage - 1) }).toString()}`}
                className={`p-2 rounded-lg text-muted hover:bg-cream-2 transition-all ${currentPage <= 1 ? "pointer-events-none opacity-30" : ""}`}
              >
                <ChevronLeft size={16} />
              </Link>
              <Link
                href={`?${new URLSearchParams({ ...searchParams, page: String(currentPage + 1) }).toString()}`}
                className={`p-2 rounded-lg text-muted hover:bg-cream-2 transition-all ${currentPage >= totalPages ? "pointer-events-none opacity-30" : ""}`}
              >
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
