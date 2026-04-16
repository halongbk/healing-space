"use client";

import { useState, useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import { RoomName } from "@/types";

interface HeroProps {
  room: RoomName;
}

interface RoomConfig {
  gradient: string;
  pill: string;
  title: ReactNode;
  sub: string;
}

// Cấu hình nội dung & màu sắc cho từng phòng dựa theo yêu cầu
const roomConfigs: Record<RoomName, RoomConfig> = {
  breathe: {
    gradient: "linear-gradient(150deg, #0A180E, #162810)",
    pill: "🌿 Breathe Room",
    title: <>Hít thở cùng <em className="font-serif italic font-light">thiên nhiên</em></>,
    sub: "Một hơi thở chậm có thể thay đổi toàn bộ trạng thái của bạn."
  },
  still: {
    gradient: "linear-gradient(150deg, #080A18, #141028)",
    pill: "🧘 Still Room",
    title: <>Khoảng lặng <em className="font-serif italic font-light">chữa lành</em></>,
    sub: "Vài phút tĩnh lặng mỗi ngày — món quà bạn tặng cho chính mình."
  },
  feel: {
    gradient: "linear-gradient(150deg, #081820, #0E2030)",
    pill: "🌊 Feel Room",
    title: <>Cảm xúc không cần <em className="font-serif italic font-light">che giấu</em></>,
    sub: "Nhận ra cảm xúc là bước đầu tiên để xử lý và vượt qua nó."
  },
  create: {
    gradient: "linear-gradient(150deg, #1A0610, #280A1A)",
    pill: "🎨 Create Room",
    title: <>Sáng tạo <em className="font-serif italic font-light">tự do</em></>,
    sub: "Không có đúng sai. Chỉ có bạn và trang giấy trắng."
  },
  recharge: {
    gradient: "linear-gradient(150deg, #181008, #281A08)",
    pill: "☕ Recharge",
    title: <>Nạp lại <em className="font-serif italic font-light">năng lượng</em></>,
    sub: "Nghỉ ngơi không phải lười biếng — đó là đầu tư cho chính mình."
  },
  mystery: {
    gradient: "linear-gradient(150deg, #0A0A18, #181028)",
    pill: "🎁 Mystery Box",
    title: <>Bất ngờ <em className="font-serif italic font-light">chờ bạn</em></>,
    sub: "Mở hộp và để không gian chọn cho bạn hôm nay."
  }
};

export default function Hero({ room }: HeroProps) {
  const [timeStr, setTimeStr] = useState("");
  const [dateStr, setDateStr] = useState("");

  // Đồng hồ khu vực Hero
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }));
      setDateStr(now.toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long" }));
    };
    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const config = roomConfigs[room];

  return (
    <motion.div 
      className="relative w-full min-h-[220px] rounded-2xl md:rounded-3xl overflow-hidden flex items-end p-6 md:p-8"
      animate={{ background: config.gradient }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {/* Vùng Content đè lên background */}
      <div className="relative z-10 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
        
        {/* Nội dung text bên trái */}
        <div className="max-w-xl">
          {/* Pill Badge */}
          <motion.div 
            key={`${room}-pill`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-xs font-medium mb-5 shadow-sm"
          >
            {config.pill}
          </motion.div>
          
          {/* Title */}
          <motion.h2 
            key={`${room}-title`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-white text-[30px] md:text-5xl font-serif tracking-wide leading-tight mb-3"
          >
            {config.title}
          </motion.h2>

          {/* Subtitle */}
          <motion.p 
            key={`${room}-sub`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-white/55 text-[13px] md:text-base tracking-wide"
          >
            {config.sub}
          </motion.p>
        </div>

        {/* Real-time DateTime Góc phải dưới */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col md:items-end text-white/80"
        >
          <div className="font-serif text-3xl md:text-4xl font-light tracking-wide mb-1 opacity-90">{timeStr}</div>
          <div className="text-[11px] md:text-xs tracking-widest opacity-50 uppercase">{dateStr}</div>
        </motion.div>
      </div>
    </motion.div>
  );
}
