// lib/supabase/types.ts
// Auto-typed database schema for OasisPortal
// Use these everywhere instead of raw 'any' types.

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id:         string;
          email:      string;
          name:       string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id:         string;
          email:      string;
          name?:      string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?:       string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };

      cell_profile: {
        Row: {
          id:          number;
          user_id:     string;
          cell_name:   string;
          leader_name: string;
          phone:       string;
          email:       string;
          address:     string;
          image_url:   string | null;
          created_at:  string;
          updated_at:  string;
        };
        Insert: {
          user_id:     string;
          cell_name?:  string;
          leader_name?: string;
          phone?:      string;
          email?:      string;
          address?:    string;
          image_url?:  string | null;
        };
        Update: {
          cell_name?:  string;
          leader_name?: string;
          phone?:      string;
          email?:      string;
          address?:    string;
          image_url?:  string | null;
          updated_at?: string;
        };
      };

      members: {
        Row: {
          id:         number;
          user_id:    string;
          name:       string;
          phone:      string;
          email:      string;
          gender:     'Male' | 'Female' | 'Other' | null;
          dob:        string | null;
          address:    string;
          joined_at:  string;
          notes:      string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id:   string;
          name:      string;
          phone?:    string;
          email?:    string;
          gender?:   'Male' | 'Female' | 'Other' | null;
          dob?:      string | null;
          address?:  string;
          joined_at?: string;
          notes?:    string;
        };
        Update: {
          name?:      string;
          phone?:     string;
          email?:     string;
          gender?:    'Male' | 'Female' | 'Other' | null;
          dob?:       string | null;
          address?:   string;
          joined_at?: string;
          notes?:     string;
          updated_at?: string;
        };
      };

      meetings: {
        Row: {
          id:         number;
          user_id:    string;
          title:      string;
          date:       string;
          notes:      string;
          saved:      boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          title:   string;
          date?:   string;
          notes?:  string;
          saved?:  boolean;
        };
        Update: {
          title?:      string;
          date?:       string;
          notes?:      string;
          saved?:      boolean;
          updated_at?: string;
        };
      };

      attendance_records: {
        Row: {
          id:         number;
          user_id:    string;
          meeting_id: number;
          member_id:  number;
          present:    boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id:    string;
          meeting_id: number;
          member_id:  number;
          present?:   boolean;
        };
        Update: {
          present?:    boolean;
          updated_at?: string;
        };
      };

      programs: {
        Row: {
          id:          number;
          user_id:     string;
          title:       string;
          date:        string | null;
          time:        string | null;
          venue:       string;
          description: string;
          created_at:  string;
          updated_at:  string;
        };
        Insert: {
          user_id:     string;
          title:       string;
          date?:       string | null;
          time?:       string | null;
          venue?:      string;
          description?: string;
        };
        Update: {
          title?:       string;
          date?:        string | null;
          time?:        string | null;
          venue?:       string;
          description?: string;
          updated_at?:  string;
        };
      };

      celebrations: {
        Row: {
          id:         number;
          user_id:    string;
          member_id:  number | null;
          name:       string;
          event:      string;
          event_date: string | null;
          notes:      string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id:    string;
          member_id?: number | null;
          name:       string;
          event?:     string;
          event_date?: string | null;
          notes?:     string;
        };
        Update: {
          name?:       string;
          event?:      string;
          event_date?: string | null;
          notes?:      string;
          updated_at?: string;
        };
      };
    };

    Views: {
      cell_profile_v: {
        Row: {
          id:          number;
          user_id:     string;
          cell_name:   string;
          cell_leader: string;   // alias for leader_name
          phone:       string;
          email:       string;
          address:     string;
          image_url:   string | null;
          created_at:  string;
          updated_at:  string;
        };
      };
      dashboard_stats: {
        Row: {
          user_id:               string;
          cell_name:             string;
          cell_leader:           string;
          total_members:         number;
          male_count:            number;
          female_count:          number;
          total_meetings:        number;
          last_meeting_date:     string | null;
          attendance_rate_pct:   number;
          upcoming_programs:     number;
          next_program:          { title: string; date: string; venue: string } | null;
          upcoming_celebrations: number;
        };
      };
    };

    Functions: {
      delete_user_account: {
        Args: { p_user_id: string };
        Returns: void;
      };
    };
  };
}

// ── Convenience row types ──────────────────────────────────────────────────────
export type Profile           = Database['public']['Tables']['profiles']['Row'];
export type CellProfile       = Database['public']['Tables']['cell_profile']['Row'];
export type Member            = Database['public']['Tables']['members']['Row'];
export type Meeting           = Database['public']['Tables']['meetings']['Row'];
export type AttendanceRecord  = Database['public']['Tables']['attendance_records']['Row'];
export type Program           = Database['public']['Tables']['programs']['Row'];
export type Celebration       = Database['public']['Tables']['celebrations']['Row'];
export type DashboardStats    = Database['public']['Views']['dashboard_stats']['Row'];
export type CellProfileView   = Database['public']['Views']['cell_profile_v']['Row'];