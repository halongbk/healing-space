/** Tên 6 phòng chữa lành */
export type RoomName = "breathe" | "still" | "feel" | "create" | "recharge" | "mystery";

/** Thông tin 1 phòng */
export interface Room {
  id: RoomName;
  name: string;
  description: string;
  color: string;
}

/** Trạng thái cảm xúc của người dùng */
export type Mood = "calm" | "stressed" | "happy" | "sad" | "anxious" | "neutral";

/** Bản ghi hoạt động của người dùng */
export interface ActivityLog {
  id: string;
  room: RoomName;
  startedAt: string;        // ISO date string
  durationSeconds: number;
  mood?: Mood;
  note?: string;
}

/** User profile (nếu đăng nhập qua Supabase) */
export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: string;
}
