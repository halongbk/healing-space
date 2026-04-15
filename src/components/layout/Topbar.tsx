"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Topbar() {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [timeStr, setTimeStr] = useState<string>("");
  const [toast, setToast] = useState<string | null>(null);

  // Lưu trữ Audio objects
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    // Khởi tạo audio chỉ ở client-side
    audioRefs.current = {
      rain: new Audio("/sounds/rain.mp3"),
      forest: new Audio("/sounds/forest.mp3"),
      cafe: new Audio("/sounds/cafe.mp3"),
    };

    // Đặt vòng lặp vô tận cho hiệu ứng âm thanh nền
    Object.values(audioRefs.current).forEach((audio) => {
      audio.loop = true;
    });

    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }));
    };
    
    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => {
      clearInterval(timer);
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
    };
  }, []);

  const toggleSound = (soundId: string) => {
    const audioItems = audioRefs.current;
    
    if (activeSound === soundId) {
      // Tắt nếu click lại âm thanh đang chạy
      audioItems[soundId]?.pause();
      setActiveSound(null);
    } else {
      // Tắt âm thanh cũ
      if (activeSound && audioItems[activeSound]) {
        audioItems[activeSound].pause();
      }
      
      // Bật âm thanh mới
      const newAudio = audioItems[soundId];
      if (newAudio) {
        newAudio.play().then(() => {
          setActiveSound(soundId);
        }).catch(() => {
          // Lỗi nếu file mp3 chưa có trong public/sounds/
          showToast("Chưa có file âm thanh");
          setActiveSound(null);
        });
      }
    }
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
        {/* Box trái: Logo & Tagline */}
        <div className="flex items-center gap-4">
          <Link href="/rooms" className="flex items-center text-xl text-ink">
            <span className="font-serif">Healing</span>
            <em className="font-serif italic text-moss ml-1 font-light pr-1">Space</em>
          </Link>

          {/* Tagline (Ẩn trên mobile) */}
          <span className="hidden md:inline-block text-[13px] text-muted opacity-80 border-l border-cream-3 pl-4 ml-2">
            Your quiet corner &middot; Không gian riêng của bạn
          </span>
        </div>

        {/* Box phải: Nút âm thanh & Đồng hồ */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            {sounds.map((s) => (
              <button
                key={s.id}
                onClick={() => toggleSound(s.id)}
                className={`flex items-center justify-center w-[34px] h-[34px] rounded-full border transition-all text-sm
                  ${activeSound === s.id 
                    ? "bg-moss-light text-moss border-moss/30 shadow-sm" 
                    : "border-cream-3 text-muted hover:bg-cream-2 hover:border-hint/30"}`}
                title={s.label}
              >
                {s.icon}
              </button>
            ))}
          </div>

          {/* Đồng hồ digital (Ẩn trên mobile) */}
          <div className="hidden md:block font-serif text-xl tracking-wide font-light text-ink min-w-[50px] text-right">
            {timeStr}
          </div>
        </div>
      </header>
      
      {/* Thông báo Toast hiện lên khi lỗi/tin nhắn */}
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
