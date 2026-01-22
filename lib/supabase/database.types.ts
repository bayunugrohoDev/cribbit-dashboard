export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bids: {
        Row: {
          created_at: string | null
          id: string
          location_id: string
          message: string | null
          price: number | null
          price_max: number | null
          price_min: number | null
          status: string | null
          user_id: string
          watch_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          location_id: string
          message?: string | null
          price?: number | null
          price_max?: number | null
          price_min?: number | null
          status?: string | null
          user_id: string
          watch_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          location_id?: string
          message?: string | null
          price?: number | null
          price_max?: number | null
          price_min?: number | null
          status?: string | null
          user_id?: string
          watch_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bids_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bids_watch_id_fkey"
            columns: ["watch_id"]
            isOneToOne: false
            referencedRelation: "watches"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_participants: {
        Row: {
          chat_id: string | null
          created_at: string | null
          id: string
          last_read_at: string | null
          unread_count: number | null
          user_id: string | null
        }
        Insert: {
          chat_id?: string | null
          created_at?: string | null
          id?: string
          last_read_at?: string | null
          unread_count?: number | null
          user_id?: string | null
        }
        Update: {
          chat_id?: string | null
          created_at?: string | null
          id?: string
          last_read_at?: string | null
          unread_count?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_participants_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          created_at: string | null
          id: string
          last_message: string | null
          last_message_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_message?: string | null
          last_message_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_message?: string | null
          last_message_at?: string | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          formatted_address: string
          id: string
          latitude: number | null
          longitude: number | null
          place_id: string
          postal_code: string | null
          region: string | null
          street: string | null
          street_number: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          formatted_address: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          place_id: string
          postal_code?: string | null
          region?: string | null
          street?: string | null
          street_number?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          formatted_address?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          place_id?: string
          postal_code?: string | null
          region?: string | null
          street?: string | null
          street_number?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          chat_id: string
          created_at: string | null
          id: string
          message: string
          sender_id: string
        }
        Insert: {
          chat_id: string
          created_at?: string | null
          id?: string
          message: string
          sender_id: string
        }
        Update: {
          chat_id?: string
          created_at?: string | null
          id?: string
          message?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"] | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          bathrooms: number | null
          bedrooms: number | null
          city: string | null
          country: string | null
          created_at: string
          description: string | null
          district: string | null
          google_photo_ref: string | null
          id: string
          latitude: number | null
          longitude: number | null
          owner_id: string | null
          postal_code: string | null
          price: number
          region: string | null
          status: string
          street: string | null
          street_number: string | null
          timezone: string | null
          title: string
          updated_at: string
        }
        Insert: {
          address: string
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          district?: string | null
          google_photo_ref?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          owner_id?: string | null
          postal_code?: string | null
          price: number
          region?: string | null
          status: string
          street?: string | null
          street_number?: string | null
          timezone?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          address?: string
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          district?: string | null
          google_photo_ref?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          owner_id?: string | null
          postal_code?: string | null
          price?: number
          region?: string | null
          status?: string
          street?: string | null
          street_number?: string | null
          timezone?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      property_interests: {
        Row: {
          created_at: string | null
          id: string
          property_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          property_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          property_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_interests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_interests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_homes: {
        Row: {
          address: string | null
          created_at: string | null
          id: string
          is_owner: boolean | null
          lat: number | null
          lng: number | null
          user_id: string | null
          verified_address: boolean | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          id?: string
          is_owner?: boolean | null
          lat?: number | null
          lng?: number | null
          user_id?: string | null
          verified_address?: boolean | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          id?: string
          is_owner?: boolean | null
          lat?: number | null
          lng?: number | null
          user_id?: string | null
          verified_address?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_homes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      watches: {
        Row: {
          created_at: string | null
          id: string
          location_id: string
          scope: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          location_id: string
          scope: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          location_id?: string
          scope?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watches_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_chat_with_participant: {
        Args: { other_user_id: string }
        Returns: string
      }
      create_chat_with_participants: {
        Args: { p_other_user_ids: string[] }
        Returns: string
      }
      get_chat_messages: {
        Args: { p_chat_id: string }
        Returns: {
          chat_id: string
          created_at: string
          id: string
          message: string
          sender: Json
          sender_id: string
        }[]
      }
      get_chat_participants: { Args: { p_chat_id: string }; Returns: Json }
      get_common_chat_id: {
        Args: { user_id_1: string; user_id_2: string }
        Returns: {
          chat_id: string
        }[]
      }
      get_my_chats: {
        Args: never
        Returns: {
          chat_id: string
          last_message: string
          last_message_at: string
          participants: Json
          unread_count: number
        }[]
      }
      increment_unread: {
        Args: { p_chat_id: string; p_sender_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "user" | "admin" | "super_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["user", "admin", "super_admin"],
    },
  },
} as const
