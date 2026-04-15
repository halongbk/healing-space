"use client";

import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/Toast";

const COLORS = [
  { val: '#2A2520', class: '' },
  { val: '#3D6B52', class: '' },
  { val: '#4A3F6B', class: '' },
  { val: '#3A7CA5', class: '' },
  { val: '#7A3A50', class: '' },
  { val: '#B08050', class: '' },
  { val: '#E8C090', class: '' },
  { val: '#F7F4EE', class: 'border-[1.5px] border-[#ccc]' },
];

export default function CreateRoom() {
  const { toast } = useToast();
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawColor, setDrawColor] = useState('#2A2520');
  const [drawSize, setDrawSize] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    // Fill background on init
    if (canvasRef.current) {
       const ctx = canvasRef.current.getContext('2d');
       if (ctx) {
         ctx.fillStyle = '#FAF8F2';
         ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
       }
    }
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const cv = canvasRef.current;
    const r = cv.getBoundingClientRect();
    const scX = cv.width / r.width;
    const scY = cv.height / r.height;
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    return { x: (clientX - r.left) * scX, y: (clientY - r.top) * scY };
  };

  const draw = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    // e.preventDefault() -> can't do here on synthetic React events for touch, relying on standard touch-action CSS
    if (!isDrawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    const p = getPos(e);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = drawSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const p = getPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    }
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const cv = canvasRef.current;
    const ctx = cv?.getContext('2d');
    if (cv && ctx) {
      ctx.fillStyle = '#FAF8F2';
      ctx.fillRect(0, 0, cv.width, cv.height);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-[960px] mx-auto w-full">
      {/* Prompt Banner */}
      <div className="rounded-[14px] p-[18px] md:px-5 mb-1 relative overflow-hidden" style={{ background: "linear-gradient(150deg,#1A0610,#280A1A)" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 80% 20%,rgba(122,58,80,.25),transparent 50%)" }}></div>
        <div className="text-[9.5px] font-semibold tracking-[1px] uppercase text-white/35 mb-2 relative">Chủ đề tuần này</div>
        <div className="font-serif text-[19px] italic text-white leading-[1.4] mb-1 relative">Vẽ một màu sắc thể hiện cảm xúc bạn đang có</div>
        <div className="text-[11.5px] text-white/40 relative">Doodle đơn giản, abstract, hay màu thuần túy đều được. Không có đúng sai.</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Canvas Block */}
        <div>
          <div className="text-[12.5px] font-medium mb-2 text-ink">Canvas của bạn</div>
          <div className="bg-cream rounded-[14px] overflow-hidden aspect-square border border-line">
            <canvas 
              id="hs-doodle" 
              ref={canvasRef}
              width="500" 
              height="500"
              className="w-full h-full block cursor-crosshair touch-none"
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={(e) => { e.currentTarget.style.touchAction = 'none'; startDraw(e); }}
              onTouchMove={(e) => { e.currentTarget.style.touchAction = 'none'; draw(e); }}
              onTouchEnd={(e) => { e.currentTarget.style.touchAction = 'auto'; stopDraw(); }}
            />
          </div>
          <div className="p-2.5 px-3 bg-white border-t border-line flex flex-wrap gap-1 items-center rounded-b-[14px]">
             {COLORS.map(c => (
               <div 
                 key={c.val}
                 onClick={() => setDrawColor(c.val)}
                 className={`w-5 h-5 rounded-full border-2 cursor-pointer transition-all ${drawColor === c.val ? "border-ink scale-125" : "border-transparent"} ${c.class}`}
                 style={{ background: c.val }}
               />
             ))}
             <div className="w-[1px] h-[18px] bg-line mx-1"></div>
             {[3, 7, 14].map((s, i) => (
                <button 
                  key={s}
                  onClick={() => setDrawSize(s)}
                  className={`py-[3px] px-[9px] rounded-md border text-[11px] font-sans transition-all ${drawSize === s ? "bg-ink text-white border-ink" : "bg-transparent text-muted border-line hover:bg-cream"}`}
                >
                  {["S", "M", "L"][i]}
                </button>
             ))}
             <div className="ml-auto flex gap-1 items-center mt-2 md:mt-0">
                <button onClick={clearCanvas} className="bg-transparent text-ink border border-line rounded-[7px] px-3.5 py-1.5 text-[12px] font-medium hover:bg-cream transition-opacity">Xóa</button>
                <button onClick={() => toast('Đã đăng tác phẩm! ✨','+20 pts')} className="bg-rose text-white rounded-[7px] px-3.5 py-1.5 text-[12px] font-medium hover:opacity-85 transition-opacity">Đăng</button>
             </div>
          </div>
        </div>

        {/* Gallery Block */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[12.5px] font-medium text-ink">Tác phẩm của team</span>
            <span className="text-[11px] text-hint">12 tác phẩm</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2.5">
             <div className="rounded-[10px] overflow-hidden aspect-square flex items-center justify-center text-[28px] cursor-pointer border-[1.5px] border-line transition-all hover:border-black/20 hover:scale-[1.04] relative group" style={{ background: "linear-gradient(135deg,#E0EDE5,#C0D8C8)"}}>
                🌿
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[10.5px] text-white font-medium">Minh · 28❤️</span>
                </div>
             </div>
             <div className="rounded-[10px] overflow-hidden aspect-square flex items-center justify-center text-[28px] cursor-pointer border-[1.5px] border-line transition-all hover:border-black/20 hover:scale-[1.04] relative group" style={{ background: "linear-gradient(135deg,#F5EBD8,#E8D0A8)"}}>
                ☀️
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[10.5px] text-white font-medium">Lan · 22❤️</span>
                </div>
             </div>
             <div className="rounded-[10px] overflow-hidden aspect-square flex items-center justify-center text-[28px] cursor-pointer border-[1.5px] border-line transition-all hover:border-black/20 hover:scale-[1.04] relative group" style={{ background: "linear-gradient(135deg,#E0EEF8,#C0D8F0)"}}>
                🌊
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[10.5px] text-white font-medium">Hà · 19❤️</span>
                </div>
             </div>
             <div className="rounded-[10px] overflow-hidden aspect-square flex items-center justify-center text-[28px] cursor-pointer border-[1.5px] border-line transition-all hover:border-black/20 hover:scale-[1.04] relative group" style={{ background: "linear-gradient(135deg,#F5E0E8,#E8C0D0)"}}>
                🌸
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[10.5px] text-white font-medium">Nam · 15❤️</span>
                </div>
             </div>
          </div>
          <button className="w-full bg-transparent text-ink border border-line rounded-xl px-5 py-2 text-[12px] font-medium hover:bg-cream-2 transition-opacity" onClick={() => toast('Đang phát triển tính năng này...')}>
             Xem tất cả tác phẩm
          </button>
        </div>
      </div>
    </div>
  );
}
