"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./useUser";
import type { GratitudeEntry } from "@/types/database";

interface UseGratitudeReturn {
  entries: GratitudeEntry[];
  loading: boolean;
  adding: boolean;
  error: string | null;
  fetchEntries: () => Promise<void>;
  addEntry: (text: string) => Promise<boolean>;
  deleteEntry: (id: string) => Promise<boolean>;
}

/**
 * useGratitude — quản lý Hũ Biết Ơn qua Supabase
 */
export function useGratitude(): UseGratitudeReturn {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { authUser } = useUser();
  const supabase = createClient();

  const fetchEntries = useCallback(async () => {
    if (!authUser) return;
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("gratitude_entries")
        .select("*")
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false })
        .limit(30);

      if (fetchError) throw fetchError;
      setEntries((data || []) as GratitudeEntry[]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi tải dữ liệu";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [authUser, supabase]);

  useEffect(() => {
    if (authUser) fetchEntries();
  }, [authUser, fetchEntries]);

  const addEntry = async (text: string): Promise<boolean> => {
    if (!authUser || !text.trim()) return false;
    try {
      setAdding(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from("gratitude_entries")
        .insert({ user_id: authUser.id, text: text.trim() })
        .select()
        .single();

      if (insertError) throw insertError;

      // Thêm vào đầu list (optimistic update)
      setEntries((prev) => [data as GratitudeEntry, ...prev].slice(0, 30));
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi thêm entry";
      setError(msg);
      return false;
    } finally {
      setAdding(false);
    }
  };

  const deleteEntry = async (id: string): Promise<boolean> => {
    if (!authUser) return false;
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from("gratitude_entries")
        .delete()
        .eq("id", id)
        .eq("user_id", authUser.id);

      if (deleteError) throw deleteError;

      // Xóa khỏi list
      setEntries((prev) => prev.filter((e) => e.id !== id));
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi xóa entry";
      setError(msg);
      return false;
    }
  };

  return { entries, loading, adding, error, fetchEntries, addEntry, deleteEntry };
}
