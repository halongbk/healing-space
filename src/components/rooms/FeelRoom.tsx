"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toast";

const EMO_RES: Record<string, string> = {
  'Buồn':     'Buồn bã là hoàn toàn bình thường. Hãy cho phép bản thân cảm nhận nó. Thử phòng Breathe hoặc viết ra ở Journal nhé.',
  'Lo lắng':  'Lo lắng là dấu hiệu bạn quan tâm đến điều quan trọng. Hít thở chậm 3 lần — phòng Breathe đang chờ bạn.',
  'Bực bội':  'Cơn bực bội cần được thể hiện ra. Viết hết vào Journal — không ai đọc đâu.',
  'Mệt mỏi':  'Cơ thể đang gửi tín hiệu quan trọng. Thử 1 micro-break ở phòng Recharge — chỉ 5 phút thôi.',
  'Rối bời':  'Khi đầu óc rối, hãy trở về với hơi thở. 2 phút thiền ở Still có thể giúp bạn lấy lại trung tâm.',
  'Xúc động': 'Cảm xúc xúc động là dấu hiệu bạn đang kết nối sâu với điều gì đó. Hãy cảm nhận trọn vẹn.',
  'Bình thản':'Trạng thái tuyệt vời! Duy trì nó với 1 affirmation ở Still hoặc vẽ gì đó ở Create.',
  'Vui vẻ':   'Tuyệt vời! Ghi xuống ở Hũ Biết Ơn điều bạn đang vui hôm nay để nhớ lại vào ngày khó hơn.',
  'Biết ơn':  'Biết ơn là cảm xúc mạnh mẽ nhất để cân bằng tâm lý. Ghi xuống ở Hũ Biết Ơn ngay nhé!',
  'Hứng khởi':'Năng lượng đang cao! Kênh nó vào phòng Create — hãy vẽ gì đó thể hiện cảm giác này.',
  'Tự tin':   'Giữ nguyên cảm giác này. Một affirmation ở Still sẽ củng cố thêm.',
  'Được yêu': 'Cảm giác ấm áp nhất. Ghi xuống ở Hũ Biết Ơn để nhớ lại vào ngày khó hơn.',
};

const EMO_LIST = [
  {icon: '😔', label: 'Buồn'}, {icon: '😰', label: 'Lo lắng'}, {icon: '😤', label: 'Bực bội'}, {icon: '😴', label: 'Mệt mỏi'},
  {icon: '😕', label: 'Rối bời'}, {icon: '😢', label: 'Xúc động'}, {icon: '😌', label: 'Bình thản'}, {icon: '😊', label: 'Vui vẻ'},
  {icon: '🥰', label: 'Biết ơn'}, {icon: '🌟', label: 'Hứng khởi'}, {icon: '💪', label: 'Tự tin'}, {icon: '🤗', label: 'Được yêu'}
];

const GK = 'hs-gratitude';

export default function FeelRoom() {
  const { toast } = useToast();
  
  // -- Emotion State --
  const [activeEmo, setActiveEmo] = useState<string | null>(null);
  
  // -- Journal --
  const [journalText, setJournalText] = useState("");

  const releaseJournal = () => {
    if (!journalText.trim()) { 
      toast('Hãy viết điều gì đó trước nhé 🌿'); 
      return; 
    }
    
    // Inject float particles
    const colors = ['#E0EDE5','#E0EEF8','#F5EBD8','#F5E0E8','#E8E3F5'];
    for (let i = 0; i < 10; i++) {
       const p = document.createElement('div');
       p.style.cssText = `position:fixed;z-index:9999;width:8px;height:8px;border-radius:50%;background:${colors[i%5]};pointer-events:none;left:${40+Math.random()*20}%;bottom:40%;animation:float-p ${1.2+Math.random()*.6}s ease forwards ${i*.08}s`;
       document.body.appendChild(p);
       setTimeout(() => p.remove(), 2000);
    }
    
    setTimeout(() => { 
      setJournalText(''); 
      toast('Đã thả đi 🌊', 'Cảm ơn bạn đã tin tưởng không gian này'); 
    }, 400);
  };

  // -- Gratitude Jar --
  const [gratInput, setGratInput] = useState("");
  const [gratList, setGratList] = useState<{text: string, date: string}[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(GK);
    if (saved) setGratList(JSON.parse(saved));
  }, []);

  const addGratitude = () => {
    if (!gratInput.trim()) return;
    const item = { text: gratInput.trim(), date: new Date().toLocaleDateString('vi-VN') };
    const newList = [item, ...gratList].slice(0, 30);
    setGratList(newList);
    localStorage.setItem(GK, JSON.stringify(newList));
    setGratInput('');
    toast('💛 Đã thêm vào Hũ Biết Ơn!');
  };

  return (
    <div className="flex flex-col gap-4 max-w-[960px] mx-auto w-full">
      {/* CSS Block inject cho Animation Float Particle */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-p { 0%{transform:translateY(0) scale(1);opacity:1} 100%{transform:translateY(-200px) scale(0);opacity:0} }
      `}}/>

      {/* Emotion Card */}
      <div className="bg-white border border-cream-3 rounded-[18px] overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,.06)]">
        <div className="p-6 pb-5 relative overflow-hidden min-h-[140px] flex flex-col justify-end" style={{ background: "linear-gradient(150deg,#081820,#0E2030)" }}>
          <div className="absolute top-[18px] left-[18px] text-[10px] font-semibold tracking-[0.8px] uppercase px-3 py-1 rounded-full" style={{ background: "rgba(58,124,165,.4)", color: "#8ACAE8", border: "1px solid rgba(138,202,232,.3)" }}>
            🌊 Emotion Check-in
          </div>
          <div className="font-serif text-2xl font-medium text-white mb-1">Bạn đang <em className="italic">cảm thấy</em> gì?</div>
          <div className="text-[13px] text-white/55">Nhận ra cảm xúc là bước đầu tiên để xử lý nó</div>
        </div>
        
        <div className="p-5 md:p-[26px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {EMO_LIST.map(e => (
              <button 
                key={e.label}
                onClick={() => setActiveEmo(e.label)}
                className={`py-3 px-1.5 rounded-xl border-[1.5px] bg-white cursor-pointer text-center transition-all duration-220 font-sans hover:-translate-y-0.5 hover:shadow-sm hover:border-black/15 ${activeEmo === e.label ? "bg-moss-light border-moss -translate-y-0.5" : "border-cream-3"}`}
              >
                <span className="text-[22px] mb-1 block">{e.icon}</span>
                <div className={`text-[10.5px] font-medium ${activeEmo === e.label ? "text-moss-dark" : "text-muted"}`}>{e.label}</div>
              </button>
            ))}
          </div>
          {activeEmo && (
            <div className="bg-moss-light rounded-[10px] p-3 px-3.5 text-[13px] text-moss-dark leading-[1.6] mb-1">
              {EMO_RES[activeEmo] || 'Cảm ơn bạn đã chia sẻ cảm xúc với không gian này 💛'}
            </div>
          )}
        </div>
      </div>

      {/* Release Journal */}
      <div className="bg-white border border-cream-3 rounded-[18px] overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,.06)]">
        <div className="p-6 pb-5 relative overflow-hidden min-h-[140px] flex flex-col justify-end" style={{ background: "linear-gradient(150deg,#181008,#241408)" }}>
          <div className="absolute top-[18px] left-[18px] text-[10px] font-semibold tracking-[0.8px] uppercase px-3 py-1 rounded-full" style={{ background: "rgba(176,96,56,.4)", color: "#E8A882", border: "1px solid rgba(232,168,130,.3)" }}>
            📖 Release Journal
          </div>
          <div className="font-serif text-2xl font-medium text-white mb-1">Viết ra · <em className="italic">Thả đi</em></div>
          <div className="text-[13px] text-white/55">Không lưu lại · Không ai đọc · Chỉ để bạn nhẹ lòng hơn</div>
        </div>

        <div className="p-5 md:p-[26px]">
          <div className="text-[12px] text-hint mb-2.5 leading-[1.55] italic">Viết bất cứ điều gì đang nặng lòng bạn. Không cần câu văn hoàn chỉnh.</div>
          <textarea 
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            className="w-full p-3.5 px-4 border-[1.5px] border-cream-3 rounded-xl text-[14px] font-serif italic text-ink bg-white outline-none resize-none min-h-[100px] leading-[1.7] transition-colors focus:border-sky"
            placeholder="Hôm nay tôi cảm thấy..."
          />
          <div className="flex gap-2.5 mt-2.5 justify-end">
            <button className="bg-transparent text-ink border border-cream-3 rounded-xl px-[14px] py-[6px] text-[12px] font-medium hover:bg-cream-2 transition-opacity inline-flex items-center gap-1.5" onClick={() => setJournalText("")}>
               🧹 Xóa
            </button>
            <button className="bg-sky text-white rounded-xl px-[14px] py-[6px] text-[12px] font-medium hover:opacity-85 transition-opacity inline-flex items-center gap-1.5" onClick={releaseJournal}>
               ✨ Thả đi
            </button>
          </div>
        </div>
      </div>

      {/* Gratitude Jar */}
      <div className="bg-white border border-cream-3 rounded-[18px] p-5 md:p-[26px] shadow-[0_2px_20px_rgba(0,0,0,.06)]">
        <div className="text-[13px] font-medium text-ink mb-3 flex items-center justify-between">
          <span>🫙 Hũ Biết Ơn <span className="text-[11px] text-hint font-normal ml-1">Lưu trong máy bạn</span></span>
        </div>
        <div className="flex gap-2 mb-3">
          <input 
            value={gratInput}
            onChange={(e) => setGratInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addGratitude()}
            placeholder="Hôm nay tôi biết ơn..."
            className="flex-1 p-2.5 px-3.5 border-[1.5px] border-cream-3 rounded-[10px] text-[13px] font-sans text-ink bg-white outline-none transition-colors focus:border-dawn"
          />
          <button className="bg-dawn text-white rounded-[10px] px-[14px] py-[6px] text-[12px] font-medium hover:opacity-85 transition-opacity inline-flex items-center" onClick={addGratitude}>
            + Thêm
          </button>
        </div>
        <div className="flex flex-col gap-2 max-h-[240px] overflow-y-auto">
          {gratList.length === 0 ? (
            <div className="text-center p-5 text-hint italic font-serif text-[15px]">Hũ đang trống · Thêm điều đầu tiên bạn biết ơn ✨</div>
          ) : (
            gratList.map((g, i) => (
              <div key={i} className="rounded-[10px] p-3 px-3.5 flex items-start gap-2.5 border backdrop-blur-sm" style={{ background: "linear-gradient(135deg,var(--sandl),#fff)", borderColor: "rgba(176,128,80,.2)" }}>
                 <span className="text-[15px] shrink-0 mt-0.5">💛</span>
                 <div className="font-serif text-[14px] italic text-ink leading-[1.5] flex-1">{g.text}</div>
                 <div className="text-[10px] text-hint shrink-0 mt-1">{g.date}</div>
              </div>
            ))
          )}
        </div>
      </div>
      
    </div>
  );
}
