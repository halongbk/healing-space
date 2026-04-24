"use client";

import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";

// Fallback nếu DB không có data
const AFFIRMATIONS_FALLBACK = [
  'Tôi đủ tốt. Tôi đang làm hết sức mình. Và điều đó là hoàn toàn đủ.',
  'Mỗi ngày tôi đều đang phát triển, dù chậm hay nhanh.',
  'Áp lực không định nghĩa tôi — cách tôi vượt qua nó mới làm điều đó.',
  'Tôi xứng đáng được nghỉ ngơi. Dừng lại không phải là yếu đuối.',
  'Hôm nay tôi chọn ưu tiên sức khỏe tinh thần của mình.',
  'Tôi không cần hoàn hảo để xứng đáng được yêu thương và tôn trọng.',
  'Khó khăn hôm nay đang dạy tôi điều gì đó quan trọng.',
  'Tôi có quyền nói không với những điều không phục vụ cho sức khỏe của mình.',
  'Mỗi hơi thở là một cơ hội để bắt đầu lại.',
  'Tôi tin vào khả năng của mình để vượt qua ngày hôm nay.',
];

const CIRC = 2 * Math.PI * 70;

export default function StillRoom() {
  const { toast } = useToast();
  const [affirmations, setAffirmations] = useState<string[]>(AFFIRMATIONS_FALLBACK);

  // Fetch affirmations từ Supabase DB, fallback về hardcode nếu không có
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("contents")
      .select("body, title")
      .eq("type", "affirmation")
      .or("room.eq.still,room.eq.all")
      .eq("is_active", true)
      .order("weight", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          const texts = data.map((c) => (c.body || c.title) as string).filter(Boolean);
          if (texts.length > 0) setAffirmations(texts);
        }
      });
  }, []);

  // --- Logic Affirmation ---
  const [affIdx, setAffIdx] = useState(0);
  const [affOpacity, setAffOpacity] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setAffOpacity(0);
      setTimeout(() => {
        setAffIdx(prev => (prev + 1) % affirmations.length);
        setAffOpacity(1);
      }, 300);
    }, 15000);
    return () => clearInterval(timer);
  }, [affirmations.length]);

  const nextAff = () => {
    setAffOpacity(0);
    setTimeout(() => {
      setAffIdx(prev => (prev + 1) % affirmations.length);
      setAffOpacity(1);
    }, 300);
  };

  const goAff = (idx: number) => {
    setAffOpacity(0);
    setTimeout(() => {
      setAffIdx(idx);
      setAffOpacity(1);
    }, 300);
  };

  // --- Logic Timer ---
  const [mDur, setMDur] = useState(120);
  const [mRem, setMRem] = useState(120);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startMed = () => {
    setIsRunning(true);
    setMRem(mDur);
    timerRef.current = setInterval(() => {
      setMRem(prev => {
        if (prev - 1 <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsRunning(false);
          toast("✅ Hoàn thành thiền!", `${mDur / 60} phút · Bạn đã làm rất tốt`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopMed = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setMRem(mDur);
  };

  const selectDur = (s: number) => {
    setMDur(s);
    if (!isRunning) setMRem(s);
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const fmt = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const dashOffset = CIRC * (mRem / mDur);

  return (
    <div className="flex flex-col gap-4 max-w-[960px] mx-auto w-full">

      {/* Affirmation Card */}
      <div className="rounded-[18px] p-8 pb-6 mb-1 text-center relative overflow-hidden" style={{ background: "linear-gradient(160deg,#0D1A12,#1A1228)" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 30% 40%,rgba(61,107,82,.18),transparent 55%),radial-gradient(circle at 72% 68%,rgba(74,63,107,.18),transparent 50%)" }} />
        <div className="text-[10px] font-semibold tracking-[1.2px] uppercase text-white/30 mb-4 relative">✦ Affirmation hôm nay</div>

        <div
          className="font-serif text-[21px] italic text-white leading-[1.65] mb-3.5 relative max-w-[480px] mx-auto transition-opacity duration-300 min-h-[70px]"
          style={{ opacity: affOpacity }}
        >
          &ldquo;{affirmations[affIdx]}&rdquo;
        </div>

        <div className="flex gap-[5px] justify-center mb-4 relative h-4 items-center">
          {affirmations.map((_, i) => (
            <div
              key={i}
              onClick={() => goAff(i)}
              className={`h-[5px] rounded-full cursor-pointer transition-all duration-300 ${i === affIdx ? "bg-white/75 w-4" : "bg-white/20 w-[5px]"}`}
            />
          ))}
        </div>

        <button onClick={nextAff} className="relative z-10 bg-white/10 border border-white/20 text-white rounded-lg px-3.5 py-1.5 text-[12px] hover:bg-white/20 transition-all font-medium">
          Câu tiếp theo →
        </button>
      </div>

      {/* Timer Card */}
      <div className="bg-white border border-cream-3 rounded-[18px] overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,.06)]">
        <div className="p-6 pb-5 relative overflow-hidden min-h-[140px] flex flex-col justify-end" style={{ background: "linear-gradient(150deg,#080A18,#141028)" }}>
          <div className="absolute top-[18px] left-[18px] text-[10px] font-semibold tracking-[0.8px] uppercase px-3 py-1 rounded-full" style={{ background: "rgba(74,63,107,.4)", color: "#B8A8E8", border: "1px solid rgba(184,168,232,.3)" }}>
            🧘 Meditation Timer
          </div>
          <div className="font-serif text-2xl font-medium text-white mb-1">Khoảng lặng nhỏ</div>
          <div className="text-[13px] text-white/55">Chỉ vài phút thôi — đủ để reset hoàn toàn</div>
        </div>

        <div className="bg-white p-5 md:p-[26px]">
          <div className="text-center py-4 flex flex-col items-center">
            <div className="flex gap-2 justify-center mb-5 md:mb-6">
              {[120, 300, 600].map(val => (
                <button
                  key={val}
                  onClick={() => selectDur(val)}
                  className={`px-[18px] py-[8px] rounded-full border-[1.5px] text-[13px] font-medium transition-all ${
                    mDur === val ? "bg-dusk text-white border-dusk" : "border-cream-3 text-muted hover:border-dusk hover:text-dusk bg-white"
                  }`}
                >
                  {val / 60} phút
                </button>
              ))}
            </div>

            <div className="relative inline-block mx-auto mb-[18px] w-[160px] h-[160px]">
              <svg style={{ transform: "rotate(-90deg)", width: "160px", height: "160px" }} viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="70" fill="none" stroke="var(--cream2)" strokeWidth="4" />
                <circle
                  cx="80" cy="80" r="70"
                  fill="none" stroke="var(--dusk)" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={dashOffset}
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full">
                <div className="font-serif text-4xl font-light text-ink leading-tight">{fmt(mRem)}</div>
                <div className="text-[11px] text-hint">phút · giây</div>
              </div>
            </div>

            <div className="text-[13px] text-muted italic mb-[18px] min-h-[20px]">
              {isRunning ? "Đang thiền... Hãy để tâm trí nghỉ ngơi 🌿" : (mRem === 0 ? "Hoàn thành! Bạn thật tuyệt 🌟" : "Chọn thời gian và bắt đầu thiền")}
            </div>

            <div className="flex gap-2.5 justify-center">
              {!isRunning ? (
                <button className="bg-dusk text-white rounded-xl px-5 py-2 text-[13px] font-medium hover:opacity-85 transition-opacity inline-flex items-center gap-1.5" onClick={startMed}>
                  ▶ Bắt đầu
                </button>
              ) : (
                <button className="bg-transparent text-ink border border-cream-3 rounded-xl px-5 py-2 text-[13px] font-medium hover:bg-cream-2 transition-opacity inline-flex items-center gap-1.5" onClick={stopMed}>
                  ⏹ Dừng
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
