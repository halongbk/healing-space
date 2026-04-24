"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Topbar from "@/components/layout/Topbar";
import Sidebar from "@/components/layout/Sidebar";
import Hero from "@/components/layout/Hero";
import { RoomName } from "@/types";

// Các components con của từng phòng
import BreatheRoom from "@/components/rooms/BreatheRoom";
import StillRoom from "@/components/rooms/StillRoom";
import FeelRoom from "@/components/rooms/FeelRoom";
import CreateRoom from "@/components/rooms/CreateRoom";
import RechargeRoom from "@/components/rooms/RechargeRoom";
import MysteryRoom from "@/components/rooms/MysteryRoom";

// Global Toast
import Toast from "@/components/ui/Toast";


/**
 * Trang Rooms - Layout Chính
 * Kết hợp Topbar, Sidebar, Hero và Content thay đổi linh hoạt
 */
export default function RoomsLayoutPage() {
  const [activeRoom, setActiveRoom] = useState<RoomName>("breathe");
  const [currentMood, setCurrentMood] = useState<string | undefined>(undefined);

  // Router nội bộ chuyển đổi Component phòng bên dưới Hero
  const renderRoomContent = () => {
    switch (activeRoom) {
      case "breathe": return <BreatheRoom />;
      case "still": return <StillRoom />;
      case "feel": return <FeelRoom />;
      case "create": return <CreateRoom />;
      case "recharge": return <RechargeRoom />;
      case "mystery": return <MysteryRoom mood={currentMood} />;
      default: return <BreatheRoom />;
    }
  };

  return (
    <div className="min-h-screen bg-cream text-ink flex flex-col font-sans">
      {/* 1. Topbar cố định trên cùng */}
      <Topbar />
      
      {/* 2. Split layout: Sidebar trái & Main Space phải */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
        <Sidebar activeRoom={activeRoom} onRoomChange={setActiveRoom} onMoodChange={setCurrentMood} />
        
        {/* Main Workspace container */}
        <main className="flex-1 overflow-y-auto w-full p-4 md:p-6 lg:p-8 flex flex-col gap-6 scroll-smooth">
          {/* 2.1. Hero - Đổi màu theo phòng */}
          <Hero room={activeRoom} />
          
          {/* 2.2. Room Content Plugin - Hiệu ứng mờ khi switch */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRoom}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex-1 w-full"
            >
              {renderRoomContent()}
            </motion.div>
          </AnimatePresence>
          
          {/* Spacer box */}
          <div className="h-10 md:h-20 w-full shrink-0" />
        </main>
      </div>

      {/* Global Toast System */}
      <Toast />
    </div>
  );
}
