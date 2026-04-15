"use client";

import { useState, useRef, useEffect } from "react";

const TECHNIQUES = {
  box:  { phases: ["Hít vào", "Giữ", "Thở ra", "Giữ"], dur: [4, 4, 4, 4] },
  "478": { phases: ["Hít vào", "Giữ", "Thở ra"],       dur: [4, 7, 8] },
  deep:  { phases: ["Hít vào", "Thở ra"],              dur: [5, 5] },
};

type TechKey = "box" | "478" | "deep";

export default function BreatheRoom() {
  const [tech, setTech] = useState<TechKey>("box");
  const [isRunning, setIsRunning] = useState(false);
  
  // State hiển thị
  const [bCount, setBCount] = useState<number | string>("—");
  const [orbWord, setOrbWord] = useState("Sẵn sàng");
  const [phaseLbl, setPhaseLbl] = useState("Nhấn bắt đầu để thở");
  const [sessionCount, setSessionCount] = useState(0);
  
  // State CSS Transform
  const [orbScale, setOrbScale] = useState(1);
  const [orbTransition, setOrbTransition] = useState("transform 1s cubic-bezier(0.4, 0, 0.2, 1)");

  // Dùng Ref để loop ngầm
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stateRef = useRef({ phIdx: 0, count: 0, isRunning: false, tech: "box" as TechKey });

  useEffect(() => {
    stateRef.current.tech = tech;
    stateRef.current.isRunning = isRunning;
  }, [tech, isRunning]);

  const startBreath = () => {
    setIsRunning(true);
    stateRef.current.isRunning = true;
    stateRef.current.phIdx = 0;
    setSessionCount(0);
    nextPhase();
  };

  const nextPhase = () => {
    const s = stateRef.current;
    const t = TECHNIQUES[s.tech];
    s.count = t.dur[s.phIdx];
    const phase = t.phases[s.phIdx];
    const dur = t.dur[s.phIdx];

    setPhaseLbl(phase.toUpperCase());
    setOrbWord(phase);
    
    // Gắn hiệu ứng Scale giống JS thuần
    setOrbTransition(`transform ${dur}s cubic-bezier(0.4, 0, 0.2, 1)`);
    if (phase === "Hít vào") setOrbScale(1.5);
    else if (phase === "Thở ra") setOrbScale(0.7);
    // Nếu phase là "Giữ", scale giữ nguyên như hiện tại (không gọi setOrbScale)

    setBCount(s.count);

    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      if (!stateRef.current.isRunning) return;
      s.count--;
      if (s.count < 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        s.phIdx = (s.phIdx + 1) % t.phases.length;
        if (s.phIdx === 0) setSessionCount(prev => prev + 1);
        if (stateRef.current.isRunning) nextPhase();
      } else {
        setBCount(s.count);
      }
    }, 1000);
  };

  const stopBreath = () => {
    setIsRunning(false);
    stateRef.current.isRunning = false;
    if (timerRef.current) clearInterval(timerRef.current);
    setOrbTransition("transform 1s cubic-bezier(0.4,0,0.2,1)");
    setOrbScale(1);
    setBCount("—");
    setPhaseLbl("Nhấn bắt đầu để thở");
    setOrbWord("Sẵn sàng");
  };

  const selectTech = (t: TechKey) => {
    setTech(t);
    if (isRunning) stopBreath();
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  return (
    <div className="flex flex-col gap-4 max-w-[960px] mx-auto w-full">
      {/* CSS Block inject cho Animation Ring Pulse */}
      <style dangerouslySetInnerHTML={{__html: `
        .b-ring { position:absolute; border-radius:50%; border:1.5px solid rgba(61,107,82,.15); animation:ring-pulse 4s ease infinite; }
        .b-ring:nth-child(1){ width:100%; height:100%; }
        .b-ring:nth-child(2){ width:132%; height:132%; animation-delay:.5s; opacity:.6; }
        .b-ring:nth-child(3){ width:164%; height:164%; animation-delay:1s; opacity:.3; }
        @keyframes ring-pulse { 0%,100%{transform:scale(1);opacity:.5} 50%{transform:scale(1.04);opacity:.2} }
      `}}/>

      {/* Main Breathing Card */}
      <div className="bg-white border border-cream-3 rounded-[18px] overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,.06)]">
        {/* Card Top */}
        <div className="p-6 pb-5 relative overflow-hidden min-h-[140px] flex flex-col justify-end" style={{ background: "linear-gradient(150deg,#0A180E,#162810)" }}>
          <div className="absolute top-[18px] left-[18px] text-[10px] font-semibold tracking-[0.8px] uppercase px-3 py-1 rounded-full" style={{ background: "rgba(61,107,82,.4)", color: "#7ACA9A", border: "1px solid rgba(122,202,154,.3)" }}>
            🌿 Breathing Exercise
          </div>
          <div className="font-serif text-2xl font-medium text-white mb-1">Chọn kỹ thuật thở</div>
          <div className="text-[13px] text-white/55">Mỗi kỹ thuật phù hợp với một trạng thái cảm xúc khác nhau</div>
        </div>

        {/* Card Body */}
        <div className="bg-white p-5 md:p-[26px]">
          <div className="flex gap-2 flex-wrap mb-6 justify-center md:justify-start">
            <button className={`px-4 py-1.5 rounded-full border-[1.5px] text-[12.5px] font-medium transition-all ${tech==='box' ? 'bg-moss text-white border-moss' : 'border-cream-3 text-muted hover:border-moss hover:text-moss bg-white'}`} onClick={()=>selectTech('box')}>📦 Box (4-4-4-4)</button>
            <button className={`px-4 py-1.5 rounded-full border-[1.5px] text-[12.5px] font-medium transition-all ${tech==='478' ? 'bg-moss text-white border-moss' : 'border-cream-3 text-muted hover:border-moss hover:text-moss bg-white'}`} onClick={()=>selectTech('478')}>✨ 4-7-8 Relax</button>
            <button className={`px-4 py-1.5 rounded-full border-[1.5px] text-[12.5px] font-medium transition-all ${tech==='deep'? 'bg-moss text-white border-moss' : 'border-cream-3 text-muted hover:border-moss hover:text-moss bg-white'}`} onClick={()=>selectTech('deep')}>🌬️ Deep (5-5)</button>
          </div>
          
          <div className="text-center py-5 px-4 mb-2 md:mb-0">
            {/* The Orb Area */}
            <div className="relative inline-flex items-center justify-center w-[200px] h-[200px] md:w-[240px] md:h-[240px] mx-auto mb-5 md:mb-5 transform scale-85 md:scale-100">
              <div className="b-ring"></div><div className="b-ring"></div><div className="b-ring"></div>
              
              <div 
                className="w-[140px] h-[140px] md:w-[160px] md:h-[160px] rounded-full border-2 flex flex-col items-center justify-center relative z-10"
                style={{ 
                  background: "radial-gradient(circle at 38% 32%,rgba(122,202,154,.4),rgba(61,107,82,.18))",
                  borderColor: "rgba(61,107,82,.3)",
                  boxShadow: "0 0 40px rgba(61,107,82,.12)",
                  transform: `scale(${orbScale})`,
                  transition: orbTransition,
                }}
              >
                <span className="text-[26px] md:text-[30px] mb-1">🌿</span>
                <span className="font-serif text-[15px] md:text-[16px] text-moss italic">{orbWord}</span>
              </div>
            </div>

            <div className="text-[10.5px] text-hint uppercase tracking-[0.6px] mb-1">{phaseLbl}</div>
            <div className="font-serif text-[42px] font-light text-ink leading-none mb-[6px]">{bCount}</div>
            <div className="text-[12.5px] text-hint mb-[18px] min-h-[18px]">
               {isRunning ? " " : "Chọn kỹ thuật và bắt đầu"}
            </div>

            <div className="flex gap-2.5 justify-center">
              {!isRunning ? (
                <button className="bg-moss text-white rounded-xl px-5 py-2 text-[13px] font-medium hover:opacity-85 transition-opacity inline-flex items-center gap-1.5" onClick={startBreath}>
                  ▶ Bắt đầu
                </button>
              ) : (
                <button className="bg-transparent text-ink border border-cream-3 rounded-xl px-5 py-2 text-[13px] font-medium hover:bg-cream-2 transition-opacity inline-flex items-center gap-1.5" onClick={stopBreath}>
                  ⏹ Dừng
                </button>
              )}
            </div>

            <div className="text-[12px] text-hint mt-2.5 min-h-[16px]">
               {sessionCount > 0 && `✓ ${sessionCount} chu kỳ hoàn thành`}
            </div>
          </div>
        </div>
      </div>

      {/* Tips Card */}
      <div className="bg-white border border-cream-3 rounded-[18px] p-5 md:p-[26px] shadow-[0_2px_20px_rgba(0,0,0,.06)]">
        <div className="text-[13px] font-medium text-ink mb-3 flex items-center justify-between">
          💡 Tại sao thở có chủ đích quan trọng
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-3 bg-cream-2 rounded-xl p-3 md:p-3.5">
             <div className="font-serif text-[22px] text-sand font-normal leading-none shrink-0 mt-0.5">01</div>
             <div className="text-[12.5px] text-muted leading-relaxed"><strong>Kích hoạt hệ thần kinh phó giao cảm</strong> — Hít thở chậm, sâu gửi tín hiệu an toàn đến não, giảm cortisol chỉ trong 60 giây.</div>
          </div>
          <div className="flex items-start gap-3 bg-cream-2 rounded-xl p-3 md:p-3.5">
             <div className="font-serif text-[22px] text-sand font-normal leading-none shrink-0 mt-0.5">02</div>
             <div className="text-[12.5px] text-muted leading-relaxed"><strong>Box Breathing</strong> được SEAL Hải quân Mỹ dùng trước nhiệm vụ căng thẳng — hiệu quả trong mọi tình huống áp lực cao.</div>
          </div>
          <div className="flex items-start gap-3 bg-cream-2 rounded-xl p-3 md:p-3.5">
             <div className="font-serif text-[22px] text-sand font-normal leading-none shrink-0 mt-0.5">03</div>
             <div className="text-[12.5px] text-muted leading-relaxed"><strong>Kỹ thuật 4-7-8</strong> của Dr. Andrew Weil — đặc biệt hiệu quả khi lo lắng, căng thẳng trước cuộc họp quan trọng.</div>
          </div>
        </div>
      </div>

    </div>
  );
}
