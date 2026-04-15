"use client";
import { useState, useEffect } from "react";

/**
 * Hook để gọi Toast từ bất cứ Client Component nào.
 * Dùng CustomEvent để không cần phải set Context rườm rà.
 */
export function useToast() {
  const toast = (message: string, subtitle: string = "") => {
    window.dispatchEvent(
      new CustomEvent("hs-toast", { detail: { message, subtitle } })
    );
  };
  return { toast };
}

/**
 * Root Component của Toast, gắn duy nhất 1 lần ở Layout.
 */
export default function Toast() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({ message: "", subtitle: "" });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleToast = (e: CustomEvent<{ message: string; subtitle: string }>) => {
      setData(e.detail);
      setOpen(true);
      clearTimeout(timer);
      timer = setTimeout(() => {
        setOpen(false);
      }, 3500);
    };

    window.addEventListener("hs-toast", handleToast as EventListener);
    return () => window.removeEventListener("hs-toast", handleToast as EventListener);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-[999] bg-[#2A2520] text-white rounded-xl px-[18px] py-[12px] text-[13px] flex items-center gap-[10px] shadow-[0_8px_32px_rgba(0,0,0,0.18)] max-w-[300px] transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
        open ? "translate-y-0 opacity-100" : "translate-y-[80px] opacity-0 pointer-events-none"
      }`}
    >
      <div>
        <div id="toast-msg">{data.message}</div>
        {data.subtitle && (
          <div className="text-[10.5px] text-white/50 mt-[2px]" id="toast-sub">
            {data.subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
