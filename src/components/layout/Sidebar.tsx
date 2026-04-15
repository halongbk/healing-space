"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RoomName } from "@/types";

interface SidebarProps {
  activeRoom: RoomName;
  onRoomChange: (room: RoomName) => void;
}

const rooms: { id: RoomName; icon: string; label: string }[] = [
  { id: "breathe", icon: "🌿", label: "Breathe" },
  { id: "still", icon: "🧘", label: "Still" },
  { id: "feel", icon: "🌊", label: "Feel" },
  { id: "create", icon: "🎨", label: "Create" },
  { id: "recharge", icon: "☕", label: "Recharge" },
  { id: "mystery", icon: "🎁", label: "Mystery" },
];

const moods = ["😔", "😴", "😊", "🌟", "🥰"];

export default function Sidebar({ activeRoom, onRoomChange }: SidebarProps) {
  const [activeMood, setActiveMood] = useState<string | null>(null);

  // Lấy trạng thái mood từ Storage khi load
  useEffect(() => {
    const savedMood = localStorage.getItem("healing_mood");
    if (savedMood) {
      setActiveMood(savedMood);
    }
  }, []);

  const handleMoodClick = (mood: string) => {
    setActiveMood(mood);
    localStorage.setItem("healing_mood", mood); // Tạm lưu LocalStorage giai đoạn 2
  };

  return (
    <aside className="
      w-full md:w-[188px] flex-shrink-0 
      border-b md:border-b-0 md:border-r border-cream-3 
      bg-cream md:bg-transparent
      md:h-[calc(100vh-54px)] overflow-x-auto md:overflow-y-auto
      [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
      flex md:flex-col justify-between
      sticky top-[54px] z-40
    ">
      {/* Danh sách phòng */}
      <nav className="flex md:flex-col gap-1 p-2 md:p-4">
        {rooms.map((room) => {
          const isActive = activeRoom === room.id;
          return (
            <button
              key={room.id}
              onClick={() => onRoomChange(room.id)}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-full md:rounded-lg md:border-l-2 text-left transition-all whitespace-nowrap
                ${isActive 
                  ? "md:border-ink bg-white md:bg-cream-2 font-medium text-ink shadow-sm md:shadow-none" 
                  : "border-transparent text-muted hover:bg-cream-2 hover:text-ink"}
              `}
            >
              <span className="text-[1.1rem] opacity-90">{room.icon}</span>
              <span className="hidden md:block text-[15px]">{room.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Mood Tracker (Chỉ hiện trên Desktop) */}
      <div className="hidden md:block p-4 mt-auto border-t border-cream-3/60 mb-2">
        <p className="text-[13px] text-hint mb-3 font-medium px-1 leading-snug">
          Bạn đang cảm thấy thế nào?
        </p>
        <div className="flex flex-wrap gap-1.5 px-0.5">
          {moods.map((mood, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleMoodClick(mood)}
              className={`
                w-[30px] h-[30px] flex items-center justify-center text-lg rounded-full transition-all border outline-none
                ${activeMood === mood 
                  ? "border-moss bg-moss-light scale-110 shadow-sm" 
                  : "border-transparent hover:bg-cream-2"}
              `}
            >
              {mood}
            </motion.button>
          ))}
        </div>
      </div>
    </aside>
  );
}
