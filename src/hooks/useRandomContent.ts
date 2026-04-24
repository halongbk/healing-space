"use client";

import { useState, useCallback, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
export type ContentItem = {
  id: string;
  type: "story" | "image" | "video" | "minigame" | "affirmation" | "quote";
  room: string;
  title: string;
  body?: string;
  media_url?: string;
  tags: string[];
  group_ids: string[];
  mood_tags: string[];
  weight: number;
  is_active: boolean;
  created_at: string;
};

type UseRandomContentOptions = {
  room: string;
  mood?: string;
  autoTrack?: boolean; // Tự động lưu session sau khi nhận content (default: true)
};

type UseRandomContentReturn = {
  content: ContentItem | null;
  isLoading: boolean;
  error: string | null;
  reason: string | null;
  poolSize: number | null;
  fetch: () => Promise<void>;        // Gọi lần đầu hoặc làm mới
  refetch: () => Promise<void>;      // Alias của fetch
  trackView: (durationSeconds?: number) => Promise<void>; // Gọi thủ công khi track view
};

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useRandomContent(options: UseRandomContentOptions): UseRandomContentReturn {
  const { room, mood, autoTrack = true } = options;

  const [content, setContent] = useState<ContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [poolSize, setPoolSize] = useState<number | null>(null);

  // Dùng ref để tránh stale closure trong trackView
  const currentContentRef = useRef<ContentItem | null>(null);

  // ─── Lưu lịch sử xem ──────────────────────────────────────────────────────
  const trackView = useCallback(async (durationSeconds = 0) => {
    if (!currentContentRef.current) return;
    try {
      await fetch("/api/sessions/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room,
          mood: mood || null,
          content_id: currentContentRef.current.id,
          duration_seconds: durationSeconds,
        }),
      });
    } catch (err) {
      // Lỗi track không nên ảnh hưởng UX
      console.warn("[useRandomContent] trackView failed:", err);
    }
  }, [room, mood]);

  // ─── Fetch content ngẫu nhiên ─────────────────────────────────────────────
  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ room });
      if (mood) params.set("mood", mood);

      const res = await fetch(`/api/content/random?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Lỗi không xác định");
        return;
      }

      const newContent = data.content as ContentItem | null;
      setContent(newContent);
      setReason(data.reason || null);
      setPoolSize(data.pool_size || null);
      currentContentRef.current = newContent;

      // Auto track sau khi nhận content
      if (autoTrack && newContent) {
        // Delay nhỏ để đảm bảo UI đã render
        setTimeout(() => {
          fetch("/api/sessions/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              room,
              mood: mood || null,
              content_id: newContent.id,
              duration_seconds: 0,
            }),
          }).catch(() => {});
        }, 500);
      }
    } catch (err) {
      setError("Không thể tải nội dung. Vui lòng thử lại.");
      console.error("[useRandomContent] fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [room, mood, autoTrack]);

  return {
    content,
    isLoading,
    error,
    reason,
    poolSize,
    fetch: fetchContent,
    refetch: fetchContent,
    trackView,
  };
}
