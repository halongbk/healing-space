"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";

const QUOTES = [
  {text:'Nghỉ ngơi không phải là phần thưởng sau khi làm xong — nó là một phần của công việc.', author:'— Placeholder Author'},
  {text:'Sức khỏe tinh thần không phải là đích đến. Đó là hành trình hàng ngày.', author:'— Placeholder Author'},
  {text:'Bạn không thể rót nước từ chiếc cốc đã cạn.', author:'— Ngạn ngữ'},
  {text:'Hãy đối xử với bản thân như cách bạn đối xử với một người bạn tốt.', author:'— Placeholder Author'},
  {text:'Chậm lại không có nghĩa là dừng lại. Đó là cách bạn đi xa hơn.', author:'— Placeholder Author'},
  {text:'Mỗi buổi sáng bạn thức dậy là một cơ hội để chọn lại.', author:'— Placeholder Author'},
  {text:'Một ngày tốt bắt đầu từ một suy nghĩ tốt.', author:'— Placeholder Author'},
  {text:'Điều duy nhất bạn có thể kiểm soát là phản ứng của mình.', author:'— Placeholder Author'},
];

const BREAKS = [
  {icon: '🚶', title: 'Đứng dậy đi lại', desc: '5 phút đi bộ, tốt cho cột sống và tuần hoàn.'},
  {icon: '💧', title: 'Uống nước', desc: '1 ly nước đầy. Mất nước nhẹ làm giảm tập trung.'},
  {icon: '👁️', title: 'Nghỉ mắt', desc: 'Nhìn xa 6m trong 20 giây — quy tắc 20-20-20.'},
  {icon: '🤸', title: 'Giãn cơ', desc: 'Xoay vai, cổ 3 lần mỗi bên. Buông tay, lắc nhẹ.'},
  {icon: '🌤️', title: 'Nhìn ra ngoài', desc: '60 giây nhìn ra cửa sổ — ánh sáng reset đồng hồ sinh học.'},
  {icon: '😄', title: 'Kết nối vui', desc: 'Nhắn 1 tin nhắn vui cho đồng nghiệp. Cười 10 giây.'},
];

export default function RechargeRoom() {
  const { toast } = useToast();
  
  // -- Breaks --
  const [doneBreaks, setDoneBreaks] = useState<number[]>([]);
  
  const handleBreak = (idx: number) => {
    if (doneBreaks.includes(idx)) return;
    setDoneBreaks([...doneBreaks, idx]);
    toast('✅ Tốt lắm!', '+1 micro-break hôm nay');
  };

  // -- Quotes --
  const [qIdx, setQIdx] = useState(0);

  const nextQuote = () => setQIdx((prev) => (prev + 1) % QUOTES.length);
  const goQuote = (i: number) => setQIdx(i);

  return (
    <div className="flex flex-col gap-4 max-w-[960px] mx-auto w-full">
      <div className="text-[12.5px] text-moss font-medium mb-1">🌿 Micro-breaks hôm nay: <span className="font-bold">{doneBreaks.length}</span>/6</div>
      
      {/* Break Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
        {BREAKS.map((b, i) => {
          const isDone = doneBreaks.includes(i);
          return (
            <div 
              key={i} 
              onClick={() => handleBreak(i)}
              className={`border-[1.5px] rounded-[14px] px-3 py-4 cursor-pointer transition-all text-center ${isDone ? "bg-moss-light border-moss" : "bg-white border-cream-3 hover:border-black/15 hover:-translate-y-0.5 hover:shadow-sm"}`}
            >
              <span className="text-[26px] mb-2 block">{b.icon}</span>
              <div className={`text-[12.5px] font-medium mb-1 ${isDone ? "text-moss-dark" : "text-ink"}`}>{b.title}</div>
              <div className={`text-[11px] leading-[1.4] ${isDone ? "text-moss-dark/80" : "text-muted"}`}>{b.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Quote Card */}
      <div className="bg-white border border-cream-3 rounded-[18px] p-5 md:p-[26px] shadow-[0_2px_20px_rgba(0,0,0,.06)]">
        <div className="text-center py-2 pb-1">
          <span className="font-serif text-[60px] text-cream-2 leading-[0.5] block mb-2">&quot;</span>
          <div className="font-serif text-[21px] italic text-ink leading-[1.6] mb-3">{QUOTES[qIdx].text}</div>
          <div className="text-[12px] text-hint tracking-[0.4px]">{QUOTES[qIdx].author}</div>
          <div className="flex gap-1.5 justify-center mt-3.5">
            {QUOTES.map((_, i) => (
              <div 
                key={i} 
                onClick={() => goQuote(i)}
                className={`h-[5px] rounded-full cursor-pointer transition-all ${i === qIdx ? "bg-moss w-4" : "bg-cream-2 w-[5px]"}`}
              />
            ))}
          </div>
          <button className="bg-transparent text-ink border border-cream-3 rounded-[7px] px-3.5 py-1.5 text-[12px] font-medium hover:bg-cream-2 transition-opacity mt-4" onClick={nextQuote}>
             → Câu tiếp theo
          </button>
        </div>
      </div>

      {/* Tips Card */}
      <div className="bg-white border border-cream-3 rounded-[18px] p-5 md:p-[26px] shadow-[0_2px_20px_rgba(0,0,0,.06)]">
        <div className="text-[13px] font-medium text-ink mb-3 flex items-center justify-between">
          💡 Nhỏ thôi, nhưng hiệu quả
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-3 bg-cream-2 rounded-xl p-3 md:p-3.5">
             <div className="font-serif text-[22px] text-sand font-normal leading-none shrink-0 mt-0.5">01</div>
             <div className="text-[12.5px] text-muted leading-relaxed">Cài nhắc nhở 5 phút mỗi 90 phút làm việc — Pomodoro mở rộng. Não hoạt động tốt nhất theo chu kỳ.</div>
          </div>
          <div className="flex items-start gap-3 bg-cream-2 rounded-xl p-3 md:p-3.5">
             <div className="font-serif text-[22px] text-sand font-normal leading-none shrink-0 mt-0.5">02</div>
             <div className="text-[12.5px] text-muted leading-relaxed">Buổi sáng đừng check điện thoại trong 15 phút đầu — để não tỉnh táo và kiểm soát ngày mới trước.</div>
          </div>
          <div className="flex items-start gap-3 bg-cream-2 rounded-xl p-3 md:p-3.5">
             <div className="font-serif text-[22px] text-sand font-normal leading-none shrink-0 mt-0.5">03</div>
             <div className="text-[12.5px] text-muted leading-relaxed">Kết thúc ngày bằng 3 điều bạn đã làm được hôm nay, dù nhỏ — tâm lý tích lũy thành công nhỏ.</div>
          </div>
        </div>
      </div>

    </div>
  );
}
