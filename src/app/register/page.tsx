"use client";

import { useState } from "react";
import { signup } from "@/app/login/actions";
import Toast, { useToast } from "@/components/ui/Toast";
import Link from "next/link";
import { Loader2, ArrowRight, Mail, Lock, Eye, EyeOff, User, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Client-side validation
  const validate = (form: FormData): boolean => {
    const errs: Record<string, string> = {};
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const confirm = form.get("confirm_password") as string;
    const displayName = form.get("display_name") as string;

    if (!displayName || displayName.trim().length < 2)
      errs.display_name = "Tên hiển thị cần ít nhất 2 ký tự";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Email không đúng định dạng";
    if (!password || password.length < 8)
      errs.password = "Mật khẩu cần ít nhất 8 ký tự";
    if (password !== confirm)
      errs.confirm_password = "Mật khẩu xác nhận không khớp";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!validate(formData)) return;

    setIsLoading(true);

    try {
      const res = await signup(formData);
      if (res?.error) {
        toast("Đăng ký thất bại", res.error);
        setIsLoading(false);
      } else if (res?.success) {
        setSuccess(true);
        setIsLoading(false);
      }
    } catch {
      // NEXT_REDIRECT
    }
  };

  return (
    <div className="flex min-h-screen bg-cream font-sans">
      {/* ═══ Cột trái: Visual Panel (ẩn mobile) ═══ */}
      <div
        className="hidden lg:flex lg:w-[40%] relative overflow-hidden flex-col justify-between p-10"
        style={{ background: "linear-gradient(160deg, #0D0A18 0%, #1A1230 40%, #251E3A 100%)" }}
      >
        <div className="relative z-10">
          <h2 className="font-serif text-2xl text-white/90">
            Healing <em className="italic text-[#B8A8E8]">Space</em>
          </h2>
          <p className="text-[12px] text-white/30 mt-1 tracking-wide">Không gian chữa lành</p>
        </div>

        <div className="relative z-10 max-w-[340px]">
          <div className="text-[56px] font-serif text-[#B8A8E8]/20 leading-none mb-2">&ldquo;</div>
          <p className="font-serif text-[22px] italic text-white/80 leading-relaxed -mt-6">
            Mỗi ngày bạn thức dậy là một cơ hội mới để chăm sóc sức khỏe tinh thần của mình.
          </p>
          <p className="text-[12px] text-white/30 mt-4 tracking-wider">— HEALING SPACE</p>
        </div>

        <div className="relative z-10 text-[11px] text-white/20 tracking-widest">
          BREATHE · STILL · FEEL · CREATE · RECHARGE
        </div>

        <div className="absolute top-[15%] right-[-8%] w-[300px] h-[300px] rounded-full bg-[#4A3F6B]/15 blur-[80px]" />
        <div className="absolute bottom-[15%] left-[-5%] w-[200px] h-[200px] rounded-full bg-[#3D6B52]/10 blur-[60px]" />
      </div>

      {/* ═══ Cột phải: Form Register ═══ */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none lg:hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full bg-dusk-light/30 blur-[100px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-moss-light/30 blur-[80px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-[420px] z-10"
        >
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-[32px] font-serif text-moss-dark leading-none">
              Healing <em className="italic text-moss">Space</em>
            </h1>
            <p className="text-[13px] text-muted mt-2">Không gian chữa lành</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.05)] border border-cream-3">
            <AnimatePresence mode="wait">
              {success ? (
                /* ═══ Success Screen ═══ */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  >
                    <CheckCircle size={56} className="mx-auto text-moss mb-4" />
                  </motion.div>
                  <h2 className="font-serif text-[24px] text-ink mb-2">Đăng ký thành công!</h2>
                  <p className="text-[13px] text-muted leading-relaxed mb-6 max-w-[300px] mx-auto">
                    Một email xác nhận đã được gửi đến hộp thư của bạn.
                    Vui lòng kiểm tra và xác nhận để bắt đầu.
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 bg-moss text-white rounded-xl px-6 py-3 text-[14px] font-medium hover:bg-moss-dark transition-all"
                  >
                    Đăng nhập ngay <ArrowRight size={16} />
                  </Link>
                </motion.div>
              ) : (
                /* ═══ Register Form ═══ */
                <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="mb-8">
                    <h2 className="font-serif text-[26px] text-ink leading-tight">
                      Tạo không gian của bạn
                    </h2>
                    <p className="text-[13px] text-muted mt-2 leading-relaxed">
                      Chỉ mất 30 giây để bắt đầu hành trình chữa lành.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Display Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-hint uppercase tracking-[0.8px]">
                        Tên hiển thị
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-hint" />
                        <input
                          name="display_name"
                          type="text"
                          required
                          placeholder="Tên bạn muốn hiển thị"
                          className="w-full bg-[#FAF8F5] border border-cream-3 rounded-xl pl-11 pr-4 py-3 text-[14px] text-ink outline-none transition-all focus:border-moss focus:bg-white focus:shadow-[0_0_0_3px_rgba(61,107,82,0.08)]"
                        />
                      </div>
                      {errors.display_name && (
                        <p className="text-[11px] text-rose font-medium">{errors.display_name}</p>
                      )}
                    </div>

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
                      {errors.email && (
                        <p className="text-[11px] text-rose font-medium">{errors.email}</p>
                      )}
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
                          minLength={8}
                          placeholder="Tối thiểu 8 ký tự"
                          className="w-full bg-[#FAF8F5] border border-cream-3 rounded-xl pl-11 pr-11 py-3 text-[14px] text-ink outline-none transition-all focus:border-moss focus:bg-white focus:shadow-[0_0_0_3px_rgba(61,107,82,0.08)]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-hint hover:text-muted transition-colors p-1"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-[11px] text-rose font-medium">{errors.password}</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-hint uppercase tracking-[0.8px]">
                        Xác nhận mật khẩu
                      </label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-hint" />
                        <input
                          name="confirm_password"
                          type={showConfirm ? "text" : "password"}
                          required
                          minLength={8}
                          placeholder="Nhập lại mật khẩu"
                          className="w-full bg-[#FAF8F5] border border-cream-3 rounded-xl pl-11 pr-11 py-3 text-[14px] text-ink outline-none transition-all focus:border-moss focus:bg-white focus:shadow-[0_0_0_3px_rgba(61,107,82,0.08)]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-hint hover:text-muted transition-colors p-1"
                        >
                          {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {errors.confirm_password && (
                        <p className="text-[11px] text-rose font-medium">{errors.confirm_password}</p>
                      )}
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
                            Tạo tài khoản
                            <ArrowRight size={16} className="text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                          </>
                        )}
                      </span>
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-[13px] text-muted">
                      Đã có tài khoản?{" "}
                      <Link
                        href="/login"
                        className="text-moss font-medium hover:text-moss-dark transition-colors underline underline-offset-4 decoration-moss/30"
                      >
                        Đăng nhập
                      </Link>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <Toast />
    </div>
  );
}
