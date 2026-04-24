"use client";

import { useEffect, useRef } from "react";
import MysteryBox from "@/components/rooms/MysteryBox";

// CSS stars animation
const starStyles = `
@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.3); }
}
@keyframes float-slow {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}
.star { animation: twinkle var(--dur, 3s) ease-in-out infinite; }
`;

function Stars() {
  const stars = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2.5,
    dur: 2 + Math.random() * 4,
    delay: Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            ["--dur" as string]: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function MysteryRoom({ mood }: { mood?: string }) {
  // Inject star CSS once
  const injected = useRef(false);
  useEffect(() => {
    if (injected.current) return;
    injected.current = true;
    const style = document.createElement("style");
    style.textContent = starStyles;
    document.head.appendChild(style);
  }, []);

  return (
    <div className="relative min-h-[500px] rounded-3xl overflow-hidden">
      {/* Background gradient huyền bí */}
      <div
        className="absolute inset-0 rounded-3xl"
        style={{
          background: "linear-gradient(135deg, #0D0B1E 0%, #1A0D35 30%, #0D1A35 60%, #0A1A1A 100%)",
        }}
      />

      {/* Stars */}
      <Stars />

      {/* Nebula glow — decorative blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-10 w-48 h-48 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }} />
      <div className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #EC4899 0%, transparent 70%)" }} />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-10 flex flex-col items-center justify-center min-h-[500px]">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-white/40 text-xs tracking-[0.2em] uppercase mb-2">Mystery Box</p>
          <h2 className="text-white/90 font-serif text-2xl md:text-3xl">
            Không gian bí ẩn của bạn
          </h2>
          <p className="text-white/40 text-sm mt-2">Nội dung được chọn riêng theo cảm xúc của bạn hôm nay ✨</p>
        </div>

        {/* MysteryBox Component */}
        <div className="w-full max-w-2xl">
          <MysteryBox mood={mood} />
        </div>
      </div>
    </div>
  );
}
