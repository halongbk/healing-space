// ═══════════════════════════════════════════════════════════════
// Healing Space — Database TypeScript Types
// Sinh từ Supabase schema (Phase 5)
// ═══════════════════════════════════════════════════════════════

// ── Utility / Enum Types ─────────────────────────────────────

export type ContentType =
  | 'story'
  | 'image'
  | 'video'
  | 'minigame'
  | 'affirmation'
  | 'quote';

export type RoomType =
  | 'breathe'
  | 'still'
  | 'feel'
  | 'create'
  | 'recharge'
  | 'mystery'
  | 'all';

export type UserRole = 'user' | 'admin';

export type ThemeType = 'light' | 'dark' | 'auto';

export type MoodEmoji = '😔' | '😴' | '😊' | '🌟' | '🥰';

// ── Table Row Types ───────────────────────────────────────────

/**
 * user_groups — Nhóm nhân viên
 */
export interface UserGroup {
  id: string;
  name: string;
  description: string | null;
  content_tags: string[];
  created_at: string;
}

/**
 * users — Profile mở rộng của từng tài khoản
 */
export interface User {
  id: string;              // Khớp với auth.users.id
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  group_id: string | null;
  role: UserRole;
  preferred_theme: ThemeType;
  preferred_sound: string | null;
  created_at: string;
  updated_at: string;
}

/** User kèm thông tin nhóm (dùng khi JOIN) */
export interface UserWithGroup extends User {
  user_groups: UserGroup | null;
}

/**
 * contents — Kho nội dung do admin quản lý
 */
export interface Content {
  id: string;
  type: ContentType;
  room: RoomType;
  title: string;
  body: string | null;
  media_url: string | null;
  tags: string[];
  group_ids: string[];   // Rỗng = hiện cho tất cả nhóm
  mood_tags: string[];   // Để filter theo cảm xúc user
  is_active: boolean;
  weight: number;        // 1–10, càng cao càng ưu tiên
  created_by: string | null;
  created_at: string;
}

/**
 * user_sessions — Lịch sử dùng app
 */
export interface UserSession {
  id: string;
  user_id: string;
  room: Exclude<RoomType, 'all'>;  // Session không có room = 'all'
  mood: string | null;
  content_id: string | null;
  duration_seconds: number;
  created_at: string;
}

/**
 * gratitude_entries — Hũ biết ơn riêng tư
 */
export interface GratitudeEntry {
  id: string;
  user_id: string;
  text: string;
  created_at: string;
}

// ── Insert / Update Payload Types ────────────────────────────

export type InsertUser = Omit<User, 'created_at' | 'updated_at'> & {
  created_at?: string;
  updated_at?: string;
};

export type UpdateUser = Partial<
  Pick<User, 'display_name' | 'avatar_url' | 'group_id' | 'preferred_theme' | 'preferred_sound'>
>;

export type InsertContent = Omit<Content, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export type InsertUserSession = Omit<UserSession, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export type InsertGratitudeEntry = {
  user_id: string;
  text: string;
};

// ── Full Database Schema Type (dùng với createClient<Database>) ──

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      user_groups: {
        Row: UserGroup;
        Insert: Omit<UserGroup, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<UserGroup, 'id'>>;
      };
      users: {
        Row: User;
        Insert: InsertUser;
        Update: UpdateUser;
      };
      contents: {
        Row: Content;
        Insert: InsertContent;
        Update: Partial<Omit<Content, 'id' | 'created_at'>>;
      };
      user_sessions: {
        Row: UserSession;
        Insert: InsertUserSession;
        Update: Partial<Omit<UserSession, 'id' | 'created_at' | 'user_id'>>;
      };
      gratitude_entries: {
        Row: GratitudeEntry;
        Insert: InsertGratitudeEntry & { id?: string; created_at?: string };
        Update: Partial<Pick<GratitudeEntry, 'text'>>;
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
  };
}
