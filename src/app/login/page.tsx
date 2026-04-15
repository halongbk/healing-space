"use client";

import { useState } from "react";
import { login, signup } from "./actions";
import Toast, { useToast } from "@/components/ui/Toast";
import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const action = isLoginMode ? login : signup;
    
    // Server action được gọi trực tiếp bằng cơ chế async client
    try {
      const res = await action(formData);
      if (res?.error) {
        toast("Truy cập bị từ chối", res.error);
        setIsLoading(false);
      }
      // Nếu thành công sẽ redirect tự động bằng lệnh của Server
    } catch (e: any) {
        // NEXT_REDIRECT ERRORs sẽ bị quăng văng tới đây nếu success, việc này là bình thường 
        // nhưng Next sẽ ngầm lo nên không sao.
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cream font-sans relative overflow-hidden">
      
      {/* Abstract Background Design */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full bg-moss-light/30 blur-[100px]" />
         <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-dusk-light/30 blur-[80px]" />
      </div>

      <div className="z-10 w-full max-w-[400px] px-6">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-[32px] font-serif mb-2 text-moss-dark leading-none">Healing <em className="italic text-moss">Space</em></h1>
          </Link>
          <p className="text-[13px] text-muted tracking-[0.5px]">Nơi bỏ lại những mệt nhoài ngoài kia.</p>
        </div>

        <motion.div 
          layout
          className="bg-white/80 backdrop-blur-xl p-8 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-cream-3 relative"
        >
           <div className="flex items-center gap-6 mb-8 border-b border-line pb-4">
             <button 
               onClick={() => setIsLoginMode(true)} 
               className={`text-[15px] font-medium transition-all relative ${isLoginMode ? "text-ink" : "text-hint hover:text-muted"}`}
             >
               Vào phòng
               {isLoginMode && <motion.div layoutId="underline" className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-ink rounded-t-full" />}
             </button>
             <button 
               onClick={() => setIsLoginMode(false)} 
               className={`text-[15px] font-medium transition-all relative ${!isLoginMode ? "text-ink" : "text-hint hover:text-muted"}`}
             >
               Khởi tạo Nhịp thở
               {!isLoginMode && <motion.div layoutId="underline" className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-ink rounded-t-full" />}
             </button>
           </div>

           <form onSubmit={handleSubmit} className="flex flex-col gap-5">
             <div className="flex flex-col gap-1.5">
               <label className="text-[11px] font-semibold text-hint uppercase tracking-[0.5px]">Email của bạn</label>
               <input 
                 name="email" 
                 type="email" 
                 required 
                 placeholder="name@company.com"
                 className="w-full bg-[#FAF8F5] border border-line rounded-xl px-4 py-3 text-[14px] text-ink outline-none transition-all focus:border-moss focus:bg-white"
               />
             </div>
             
             <div className="flex flex-col gap-1.5 mb-2">
               <label className="text-[11px] font-semibold text-hint uppercase tracking-[0.5px]">Mã khóa (Password)</label>
               <input 
                 name="password" 
                 type="password" 
                 required 
                 minLength={6}
                 placeholder="••••••••"
                 className="w-full bg-[#FAF8F5] border border-line rounded-xl px-4 py-3 text-[14px] text-ink outline-none transition-all focus:border-moss focus:bg-white tracking-[2px]"
               />
             </div>

             <button 
               type="submit" 
               disabled={isLoading}
               className="w-full bg-ink text-white rounded-xl py-3.5 mt-2 flex items-center justify-center gap-2 hover:bg-moss-dark transition-all disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
             >
                <span className="relative z-10 text-[14px] font-medium flex items-center gap-2">
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : (
                    isLoginMode ? "Bước qua cánh cửa" : "Bắt đầu đăng ký"
                  )}
                  {!isLoading && <ArrowRight size={16} className="text-white/50 group-hover:text-white transition-colors" />}
                </span>
             </button>
           </form>

           <AnimatePresence>
             {!isLoginMode && (
               <motion.div 
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                 exit={{ opacity: 0, height: 0, marginTop: 0 }}
                 className="text-[11.5px] italic text-hint text-center leading-relaxed"
               >
                 Tài khoản được bảo vệ qua hệ thống bảo mật Supabase. Hãy dùng chung pass hoặc dùng password an toàn vì tôi chưa thiết lập tính năng quên pass đâu.
               </motion.div>
             )}
           </AnimatePresence>
        </motion.div>
        
        <div className="text-center mt-6">
          <Link href="/test-db" className="text-[11px] text-hint hover:text-moss underline decoration-hint/30 underline-offset-4 transition-colors">
            Ping thử đường link Test Database?
          </Link>
        </div>
      </div>
      
      {/* Toast Render explicitly in this pure page because Layout doesn't have it by default */}
      <Toast />
    </div>
  );
}
