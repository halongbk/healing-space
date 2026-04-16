"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./useUser";

interface UseMoodSessionReturn {
  recentMood: string | null;
  loading: boolean;
  saveMood: (mood: string, room: string) => Promise<boolean>;
}

/**
 * useMoodSession — lưu mood + session vào bảng user_sessions
 */
export function useMoodSession(): UseMoodSessionReturn {
  const [recentMood, setRecentMood] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useUser();
  const supabase = createClient();

  // Lấy mood gần nhất của user hôm nay
  const getRecentMood = useCallback(async () => {
    if (!authUser) return;
    try {
      setLoading(true);

      // Lấy session mới nhất có mood
      const { data } = await supabase
        .from("user_sessions")
        .select("mood")
        .eq("user_id", authUser.id)
        .not("mood", "is", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data?.mood) {
        setRecentMood(data.mood);
      }
    } catch {
      // Không có data → recentMood = null, bình thường
    } finally {
      setLoading(false);
    }
  }, [authUser, supabase]);

  useEffect(() => {
    if (authUser) getRecentMood();
  }, [authUser, getRecentMood]);

  const saveMood = async (mood: string, room: string): Promise<boolean> => {
    if (!authUser) return false;
    try {
      const { error } = await supabase
        .from("user_sessions")
        .insert({
          user_id: authUser.id,
          room,
          mood,
          duration_seconds: 0,
        });

      if (error) throw error;

      setRecentMood(mood);
      return true;
    } catch {
      return false;
    }
  };

  return { recentMood, loading, saveMood };
}
