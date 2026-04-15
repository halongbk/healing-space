export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      gratitude_jar: {
        Row: {
          content: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          user_id?: string
        }
      }
      journal_releases: {
        Row: {
          id: string
          released_at: string
          user_id: string
        }
        Insert: {
          id?: string
          released_at?: string
          user_id: string
        }
        Update: {
          id?: string
          released_at?: string
          user_id?: string
        }
      }
      mood_logs: {
        Row: {
          id: string
          logged_at: string
          mood: string
          user_id: string
        }
        Insert: {
          id?: string
          logged_at?: string
          mood: string
          user_id: string
        }
        Update: {
          id?: string
          logged_at?: string
          mood?: string
          user_id?: string
        }
      }
    }
    Views: Record<never, never>
    Functions: Record<never, never>
    Enums: Record<never, never>
  }
}

// Shorthand types để dùng trong app
export type GratitudeEntry = Database['public']['Tables']['gratitude_jar']['Row']
export type MoodLog        = Database['public']['Tables']['mood_logs']['Row']
export type JournalRelease = Database['public']['Tables']['journal_releases']['Row']
