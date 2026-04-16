"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User } from "@/types/database";

interface UseUserReturn {
  authUser: SupabaseUser | null;
  profile: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * useUser — lấy thông tin auth user + profile từ bảng users
 * Cache kết quả trong ref để không query lại liên tục
 */
export function useUser(): UseUserReturn {
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetched = useRef(false);
  const supabase = createClient();

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setAuthUser(null);
        setProfile(null);
        return;
      }

      setAuthUser(user);

      // Lấy profile từ bảng users
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        // Profile chưa tồn tại (trigger chưa chạy xong) — dùng auth metadata
        setProfile(null);
      } else {
        setProfile(profileData as User);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi không xác định";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (!fetched.current) {
      fetched.current = true;
      fetchUser();
    }
  }, [fetchUser]);

  return { authUser, profile, loading, error, refetch: fetchUser };
}
