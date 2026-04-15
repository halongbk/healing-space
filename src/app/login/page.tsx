"use client";

import { useState } from "react";
import { login } from "./actions";
import Toast, { useToast } from "@/components/ui/Toast";
import Link from "next/link";
import { Loader2, ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await login(formData);
      if (res?.error) {
        toast("Truy cập bị từ chối", res.error);
        setIsLoading(false);
      }
    } catch {
      // NEXT_REDIRECT is thrown on success — this is normal behavior
    }
  };

  return (
    <div className="flex min-h-screen bg-cream font-sans">
      {/* ═══ Cột trái: Visual Panel (ẩn mobile) ═══ */}
      <div className="hidden lg:flex lg:w-[40%] relative overflow-hidden flex-col justify-between p-10"
           style={{ background: "linear-gradient(160deg, #0A180E 0%, #162810 40%, #1E3D2A 100%)" }}>
        {/* Logo */}
        <div className="relative z-10">
          <h2 className="font-serif text-2xl text-white/90">
            Healing <em className="italic text-[#7ACA9A]">Space</em>
          </h2>
          <p className="text-[12px] text-white/30 mt-1 tracking-wide">Không gian chữa lành</p>
        </div>

        {/* Quote trung tâm */}
        <div className="relative z-10 max-w-[340px]">
          <div className="text-[56px] font-serif text-[#7ACA9A]/20 leading-none mb-2">&ldquo;</div>
          <p className="font-serif text-[22px] italic text-white/80 leading-relaxed -mt-6">
            Nghỉ ngơi không phải là phần thưởng sau khi làm xong — nó là một phần của công việc.
          </p>
          <p className="text-[12px] text-white/30 mt-4 tracking-wider">— HEALING SPACE</p>
        </div>

        {/* Decorative elements */}
        <div className="relative z-10 text-[11px] text-white/20 tracking-widest">
          WELLNESS · MINDFULNESS · BALANCE
        </div>

        {/* Background orbs */}
        <div className="absolute top-[20%] right-[-10%] w-[350px] h-[350px] rounded-full bg-[#3D6B52]/15 blur-[80px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[250px] h-[250px] rounded-full bg-[#4A3F6B]/12 blur-[60px]" />
      </div>

      {/* ═══ Cột phải: Form Login ═══ */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        {/* Background blurs cho mobile */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none lg:hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full bg-moss-light/30 blur-[100px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-dusk-light/30 blur-[80px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-[420px] z-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-[32px] font-serif text-moss-dark leading-none">
              Healing <em className="italic text-moss">Space</em>
            </h1>
            <p className="text-[13px] text-muted mt-2">Không gian chữa lành</p>
          </div>

          {/* Form card */}
          <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.05)] border border-cream-3">
            <div className="mb-8">
              <h2 className="font-serif text-[26px] text-ink leading-tight">Chào mừng trở lại</h2>
              <p className="text-[13px] text-muted mt-2 leading-relaxed">
                Đăng nhập để quay về không gian riêng của bạn.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-hint uppercase tracking-[0.8px]">
                  Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-hint" />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="w-full bg-[#FAF8F5] border border-cream-3 rounded-xl pl-11 pr-4 py-3 text-[14px] text-ink outline-none transition-all focus:border-moss focus:bg-white focus:shadow-[0_0_0_3px_rgba(61,107,82,0.08)]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-hint uppercase tracking-[0.8px]">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-hint" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full bg-[#FAF8F5] border border-cream-3 rounded-xl pl-11 pr-11 py-3 text-[14px] text-ink outline-none transition-all focus:border-moss focus:bg-white focus:shadow-[0_0_0_3px_rgba(61,107,82,0.08)] tracking-[2px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-hint hover:text-muted transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-moss text-white rounded-xl py-3.5 mt-2 flex items-center justify-center gap-2 hover:bg-moss-dark transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed group shadow-[0_2px_12px_rgba(61,107,82,0.25)]"
              >
                <span className="text-[14px] font-medium flex items-center gap-2">
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      Đăng nhập
                      <ArrowRight size={16} className="text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Link to register */}
            <div className="mt-6 text-center">
              <p className="text-[13px] text-muted">
                Chưa có tài khoản?{" "}
                <Link
                  href="/register"
                  className="text-moss font-medium hover:text-moss-dark transition-colors underline underline-offset-4 decoration-moss/30"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <Toast />
    </div>
  );
}
