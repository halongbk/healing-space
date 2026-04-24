"use client";

import { useState, useRef, useTransition } from "react";
import Link from "next/link";
import { X, Image as ImageIcon } from "lucide-react";
import { createContent, updateContent, uploadImage, ContentFormData } from "../actions";

const TYPES = [
  { value: "story", label: "Câu chuyện" },
  { value: "affirmation", label: "Khẳng định" },
  { value: "quote", label: "Trích dẫn" },
  { value: "image", label: "Ảnh" },
  { value: "video", label: "Video" },
  { value: "minigame", label: "Minigame" },
];
const ROOMS = [
  { value: "breathe", label: "🌬️ Thở" },
  { value: "still", label: "🪨 Tĩnh lặng" },
  { value: "feel", label: "💙 Cảm xúc" },
  { value: "create", label: "✏️ Sáng tạo" },
  { value: "recharge", label: "⚡ Nạp năng lượng" },
  { value: "mystery", label: "🎁 Túi mù" },
  { value: "all", label: "🌐 Tất cả phòng" },
];
const MOODS = ["buồn", "lo lắng", "mệt mỏi", "tức giận", "bình thản", "vui vẻ", "hứng khởi", "cô đơn"];

type ExistingContent = ContentFormData & { id: string; media_url?: string };

export default function ContentForm({ existing }: { existing?: ExistingContent }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ContentFormData & { id?: string }>({
    type: existing?.type || "affirmation",
    room: existing?.room || "all",
    title: existing?.title || "",
    body: existing?.body || "",
    media_url: existing?.media_url || "",
    tags: existing?.tags || [],
    group_ids: existing?.group_ids || [],
    mood_tags: existing?.mood_tags || [],
    is_active: existing?.is_active ?? true,
    weight: existing?.weight ?? 5,
    id: existing?.id,
  });

  const isTextBased = ["story", "affirmation", "quote"].includes(form.type);
  const isImage = form.type === "image";
  const isMedia = ["video", "minigame"].includes(form.type);

  const toggleMood = (mood: string) => {
    setForm((f) => ({
      ...f,
      mood_tags: f.mood_tags?.includes(mood)
        ? f.mood_tags.filter((m) => m !== mood)
        : [...(f.mood_tags || []), mood],
    }));
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadImage(fd);
    setIsUploading(false);
    if (res.error) { setUploadError(res.error); return; }
    if (res.url) setForm((f) => ({ ...f, media_url: res.url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) { setError("Vui lòng nhập tiêu đề"); return; }
    if (isTextBased && !form.body?.trim()) { setError("Vui lòng nhập nội dung"); return; }
    if ((isImage || isMedia) && !form.media_url?.trim()) { setError("Vui lòng nhập URL hoặc upload ảnh"); return; }

    startTransition(async () => {
      const payload: ContentFormData = {
        type: form.type,
        room: form.room,
        title: form.title,
        body: form.body,
        media_url: form.media_url,
        tags: form.tags,
        group_ids: form.group_ids,
        mood_tags: form.mood_tags,
        is_active: form.is_active,
        weight: form.weight,
      };

      let res;
      if (existing?.id) {
        res = await updateContent(existing.id, payload);
      } else {
        res = await createContent(payload);
      }

      if (res?.error) setError(res.error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Error */}
      {error && (
        <div className="bg-rose/10 border border-rose/20 text-rose text-sm px-4 py-3 rounded-xl flex items-start gap-2">
          <X size={16} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Loại nội dung */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">Loại nội dung *</label>
          <select
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value, body: "", media_url: "" }))}
            className="px-3 py-2.5 border border-cream-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-moss/30"
          >
            {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        {/* Phòng */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">Phòng hiển thị *</label>
          <select
            value={form.room}
            onChange={(e) => setForm((f) => ({ ...f, room: e.target.value }))}
            className="px-3 py-2.5 border border-cream-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-moss/30"
          >
            {ROOMS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
      </div>

      {/* Tiêu đề */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">Tiêu đề *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="Nhập tiêu đề nội dung..."
          className="px-3 py-2.5 border border-cream-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-moss/30"
        />
      </div>

      {/* Body — chỉ cho text-based */}
      {isTextBased && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">Nội dung *</label>
          <textarea
            value={form.body || ""}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            placeholder="Nhập nội dung câu chuyện, trích dẫn..."
            rows={6}
            className="px-3 py-2.5 border border-cream-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-moss/30 resize-y"
          />
        </div>
      )}

      {/* Upload ảnh — chỉ cho image */}
      {isImage && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">Ảnh *</label>
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
          />
          {form.media_url ? (
            <div className="relative rounded-xl overflow-hidden border border-cream-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.media_url} alt="preview" className="w-full h-48 object-cover" />
              <button type="button" onClick={() => setForm((f) => ({ ...f, media_url: "" }))}
                className="absolute top-2 right-2 bg-ink/70 text-white rounded-full p-1 hover:bg-ink transition-all">
                <X size={14} />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => fileRef.current?.click()}
              disabled={isUploading}
              className="border-2 border-dashed border-cream-3 rounded-xl py-10 hover:border-moss/40 hover:bg-moss-light/30 transition-all flex flex-col items-center gap-2 text-muted disabled:opacity-50">
              {isUploading ? (
                <><div className="w-6 h-6 border-2 border-moss border-t-transparent rounded-full animate-spin" /><span className="text-sm">Đang upload...</span></>
              ) : (
                <><ImageIcon size={28} /><span className="text-sm">Click để chọn ảnh (tối đa 5MB)</span></>
              )}
            </button>
          )}
          {uploadError && <p className="text-rose text-xs">{uploadError}</p>}
        </div>
      )}

      {/* URL — cho video/minigame */}
      {isMedia && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">
            {form.type === "video" ? "URL Video *" : "URL Minigame (iframe) *"}
          </label>
          <input
            type="url"
            value={form.media_url || ""}
            onChange={(e) => setForm((f) => ({ ...f, media_url: e.target.value }))}
            placeholder={form.type === "video" ? "https://www.youtube.com/embed/..." : "https://..."}
            className="px-3 py-2.5 border border-cream-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-moss/30"
          />
        </div>
      )}

      {/* Weight Slider */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-ink flex items-center justify-between">
          <span>Trọng số (Weight)</span>
          <span className="text-moss font-semibold text-base">{form.weight}/10</span>
        </label>
        <input
          type="range" min={1} max={10} value={form.weight}
          onChange={(e) => setForm((f) => ({ ...f, weight: parseInt(e.target.value) }))}
          className="w-full accent-moss"
        />
        <div className="flex justify-between text-[11px] text-hint">
          <span>1 – Ít được chọn</span>
          <span>10 – Ưu tiên cao nhất</span>
        </div>
      </div>

      {/* Mood tags */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-ink">Mood phù hợp</label>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((mood) => (
            <button key={mood} type="button" onClick={() => toggleMood(mood)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                form.mood_tags?.includes(mood)
                  ? "bg-moss text-white border-moss"
                  : "bg-white text-muted border-cream-3 hover:border-moss/40"
              }`}>
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* Bật/Tắt */}
      <div className="flex items-center justify-between p-4 bg-cream-2/50 rounded-xl border border-cream-3">
        <div>
          <p className="text-sm font-medium text-ink">Trạng thái</p>
          <p className="text-xs text-muted mt-0.5">Tắt để ẩn khỏi người dùng</p>
        </div>
        <button
          type="button"
          onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
          className={`w-12 h-6 rounded-full transition-all relative ${form.is_active ? "bg-moss" : "bg-cream-3"}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${form.is_active ? "left-6" : "left-0.5"}`} />
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Link href="/admin/contents"
          className="flex-1 text-center px-5 py-2.5 border border-cream-3 rounded-full text-sm text-muted hover:bg-cream-2 transition-all">
          Hủy
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 px-5 py-2.5 bg-moss text-white rounded-full text-sm font-medium hover:bg-moss-dark transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Đang lưu..." : existing?.id ? "Lưu thay đổi" : "Thêm nội dung"}
        </button>
      </div>
    </form>
  );
}
