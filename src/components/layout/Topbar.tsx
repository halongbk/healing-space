"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, ChevronDown, User, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function Topbar() {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [timeStr, setTimeStr] = useState<string>("");
  const [toast, setToast] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false); // Tránh flash
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Khởi tạo audio
    audioRefs.current = {
      rain: new Audio("/sounds/rain.mp3"),
      forest: new Audio("/sounds/forest.mp3"),
      cafe: new Audio("/sounds/cafe.mp3"),
    };
    Object.values(audioRefs.current).forEach((audio) => {
      audio.loop = true;
      audio.volume = 0.35;
    });

    // Clock
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);

    // Lấy thông tin user từ session
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const name = user.user_metadata?.display_name || user.email?.split("@")[0] || "User";
        setUserName(name);
      } else {
        setUserName(null);
      }
      setAuthLoaded(true); // Đã biết trạng thái auth
    });

    // Lắng nghe thay đổi auth state (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const name = session.user.user_metadata?.display_name || session.user.email?.split("@")[0] || "User";
        setUserName(name);
      } else {
        setUserName(null);
      }
      setAuthLoaded(true);
    });

    // Click outside to close menu
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(timer);
      subscription.unsubscribe();
      document.removeEventListener("mousedown", handleClickOutside);
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSound = (soundId: string) => {
    const audioItems = audioRefs.current;

    if (activeSound === soundId) {
      audioItems[soundId]?.pause();
      setActiveSound(null);
    } else {
      if (activeSound && audioItems[activeSound]) {
        audioItems[activeSound].pause();
      }
      const newAudio = audioItems[soundId];
      if (newAudio) {
        newAudio.play().then(() => {
          setActiveSound(soundId);
        }).catch(() => {
          showToast("Chưa có file âm thanh");
          setActiveSound(null);
        });
      }
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    Object.values(audioRefs.current).forEach((audio) => {
      audio.pause();
    });
    await supabase.auth.signOut();
    router.push("/login");
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const sounds = [
    { id: "rain", icon: "🌧️", label: "Mưa" },
    { id: "forest", icon: "🌿", label: "Rừng" },
    { id: "cafe", icon: "☕", label: "Café" },
  ];

  return (
    <>
      <header className="sticky top-0 z-[100] h-[54px] w-full bg-[rgba(247,244,238,0.93)] backdrop-blur-sm border-b border-cream-3 flex items-center justify-between px-4 md:px-6">
        {/* Logo & Tagline */}
        <div className="flex items-center gap-4">
          <Link href="/rooms" className="flex items-center text-xl text-ink">
            <span className="font-serif">Healing</span>
            <em className="font-serif italic text-moss ml-1 font-light pr-1">Space</em>
          </Link>
          <span className="hidden md:inline-block text-[13px] text-muted opacity-80 border-l border-cream-3 pl-4 ml-2">
            Your quiet corner &middot; Không gian riêng của bạn
          </span>
        </div>

        {/* Sound buttons + Clock + User */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Sound buttons */}
          <div className="flex items-center gap-1.5 md:gap-2">
            {sounds.map((s) => (
              <button
                key={s.id}
                onClick={() => toggleSound(s.id)}
                className={`flex items-center justify-center w-[32px] h-[32px] md:w-[34px] md:h-[34px] rounded-full border transition-all text-sm
                  ${activeSound === s.id
                    ? "bg-moss-light text-moss border-moss/30 shadow-sm"
                    : "border-cream-3 text-muted hover:bg-cream-2 hover:border-hint/30"}`}
                title={s.label}
              >
                {s.icon}
              </button>
            ))}
          </div>

          {/* Clock (desktop) */}
          <div className="hidden md:block font-serif text-xl tracking-wide font-light text-ink min-w-[50px] text-right">
            {timeStr}
          </div>

          {/* Divider */}
          {authLoaded && (
            <div className="hidden md:block w-px h-6 bg-cream-3" />
          )}

          {/* Auth section — chỉ render sau khi đã biết trạng thái auth */}
          {authLoaded && (
            <>
              {userName ? (
                /* ═══ Đã đăng nhập → Hiện avatar + dropdown ═══ */
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-full hover:bg-cream-2 transition-all"
                  >
                    <div className="w-[28px] h-[28px] rounded-full bg-moss-light text-moss text-[12px] font-semibold flex items-center justify-center border border-moss/20">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:block text-[13px] text-ink font-medium max-w-[120px] truncate">
                      {userName}
                    </span>
                    <ChevronDown size={14} className={`hidden md:block text-hint transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-[calc(100%+6px)] bg-white border border-cream-3 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-[200px] overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-cream-3">
                          <p className="text-[13px] font-medium text-ink truncate">{userName}</p>
                          <p className="text-[11px] text-hint mt-0.5">Thành viên</p>
                        </div>
                        <Link
                          href="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-muted hover:bg-cream hover:text-ink transition-all border-b border-cream-3/50"
                        >
                          <User size={15} />
                          Hồ sơ cá nhân
                        </Link>
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-muted hover:bg-cream hover:text-rose transition-all disabled:opacity-50"
                        >
                          <LogOut size={15} />
                          {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* ═══ Chưa đăng nhập → Hiện nút Đăng nhập ═══ */
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-4 py-2 bg-moss text-white rounded-full text-[13px] font-medium hover:bg-moss-dark transition-all shadow-sm"
                >
                  <LogIn size={14} />
                  <span className="hidden sm:block">Đăng nhập</span>
                </Link>
              )}
            </>
          )}
        </div>
      </header>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-16 left-1/2 z-[110] bg-ink text-cream px-5 py-2.5 rounded-full shadow-lg text-sm font-medium tracking-wide flex items-center gap-2"
          >
            ⚠️ {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
