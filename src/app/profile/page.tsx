"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";
import Toast from "@/components/ui/Toast";
import { Loader2, ArrowLeft, Save, User, Mail, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { authUser, profile, loading: userLoading, refetch } = useUser();
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (profile?.display_name) {
      setDisplayName(profile.display_name);
    } else if (authUser?.user_metadata?.display_name) {
      setDisplayName(authUser.user_metadata.display_name);
    } else if (authUser?.email) {
      setDisplayName(authUser.email.split("@")[0]);
    }
  }, [profile, authUser]);

  const handleSave = async () => {
    if (!authUser || !displayName.trim()) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("users")
        .update({ display_name: displayName.trim() })
        .eq("id", authUser.id);

      if (error) throw error;

      // Cũng update auth metadata
      await supabase.auth.updateUser({
        data: { display_name: displayName.trim() },
      });

      await refetch();
      toast("✅ Đã lưu thông tin!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi lưu thông tin";
      toast("Lỗi", msg);
    } finally {
      setSaving(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream">
        <Loader2 size={24} className="animate-spin text-moss" />
      </div>
    );
  }

  if (!authUser) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-cream font-sans">
      {/* Header */}
      <div className="border-b border-cream-3 bg-[rgba(247,244,238,0.93)] backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[640px] mx-auto px-6 h-[54px] flex items-center justify-between">
          <Link
            href="/rooms"
            className="flex items-center gap-2 text-[13px] text-muted hover:text-ink transition-colors"
          >
            <ArrowLeft size={16} />
            Quay lại không gian
          </Link>
          <h1 className="font-serif text-lg text-ink">
            Healing <em className="italic text-moss">Space</em>
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[640px] mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Avatar + Title */}
          <div className="flex items-center gap-5 mb-8">
            <div className="w-[64px] h-[64px] rounded-full bg-moss-light text-moss text-[24px] font-semibold flex items-center justify-center border-2 border-moss/20 shadow-sm">
              {(displayName || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-serif text-[24px] text-ink">Hồ sơ cá nhân</h2>
              <p className="text-[13px] text-muted mt-0.5">Quản lý thông tin tài khoản của bạn</p>
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-white border border-cream-3 rounded-[18px] p-6 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,.04)]">
            <div className="flex flex-col gap-5">
              {/* Display Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-hint uppercase tracking-[0.8px] flex items-center gap-1.5">
                  <User size={12} />
                  Tên hiển thị
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-cream-3 rounded-xl px-4 py-3 text-[14px] text-ink outline-none transition-all focus:border-moss focus:bg-white focus:shadow-[0_0_0_3px_rgba(61,107,82,0.08)]"
                  placeholder="Tên bạn muốn hiển thị"
                />
              </div>

              {/* Email (readonly) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-hint uppercase tracking-[0.8px] flex items-center gap-1.5">
                  <Mail size={12} />
                  Email
                </label>
                <input
                  type="email"
                  value={authUser.email || ""}
                  readOnly
                  className="w-full bg-[#F0EDE6] border border-cream-3 rounded-xl px-4 py-3 text-[14px] text-muted outline-none cursor-not-allowed"
                />
                <p className="text-[10px] text-hint">Email không thể thay đổi</p>
              </div>

              {/* Group */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-hint uppercase tracking-[0.8px] flex items-center gap-1.5">
                  <Users size={12} />
                  Nhóm
                </label>
                <div className="w-full bg-[#F0EDE6] border border-cream-3 rounded-xl px-4 py-3 text-[14px] text-muted">
                  {profile?.role === "admin" ? "🛡️ Admin" : "🌿 Thành viên"}
                </div>
              </div>

              {/* Info row */}
              <div className="flex items-center justify-between pt-2 border-t border-cream-3">
                <p className="text-[11px] text-hint">
                  Tham gia từ: {authUser.created_at
                    ? new Date(authUser.created_at).toLocaleDateString("vi-VN")
                    : "—"}
                </p>
              </div>

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={saving || !displayName.trim()}
                className="w-full bg-moss text-white rounded-xl py-3.5 flex items-center justify-center gap-2 hover:bg-moss-dark transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_2px_12px_rgba(61,107,82,0.2)]"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Save size={16} />
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <Toast />
    </div>
  );
}
