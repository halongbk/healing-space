"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FileText, Users, Activity, ArrowLeft, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: BarChart3 },
    { name: "Nội dung", href: "/admin/contents", icon: FileText },
    { name: "Nhóm User", href: "/admin/groups", icon: Users },
    { name: "Thống kê", href: "/admin/stats", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-ink/20 z-40 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-[260px] bg-white border-r border-cream-3 shadow-sm transform transition-transform duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-cream-3 flex items-center justify-between">
          <Link href="/admin" className="flex items-center text-xl text-ink font-serif">
            Healing <em className="italic text-moss ml-1 pr-1 font-light">Admin</em>
          </Link>
          <button className="md:hidden text-muted" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-colors ${
                  isActive
                    ? "bg-moss-light text-moss"
                    : "text-muted hover:bg-cream-2 hover:text-ink"
                }`}
              >
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-cream-3">
          <Link
            href="/rooms"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium text-muted hover:bg-cream-2 hover:text-ink transition-colors"
          >
            <ArrowLeft size={18} />
            Về trang chính
          </Link>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen w-full relative">
        {/* Topbar Mobile (Chỉ hiện khi màn hình nhỏ) */}
        <header className="md:hidden h-[60px] bg-white border-b border-cream-3 px-4 flex items-center sticky top-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-ink rounded-lg hover:bg-cream-2"
          >
            <Menu size={22} />
          </button>
          <div className="ml-2 font-serif text-lg text-ink">
            Admin Workspace
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="flex-1 p-4 md:p-8 w-full max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
