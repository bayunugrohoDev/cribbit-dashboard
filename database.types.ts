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
      bankid_sessions: {
        Row: {
          cached_session_data: Json | null
          cached_user_data: Json | null
          completed_at: string | null
          created_at: string | null
          device_id: string | null
          device_ip: string | null
          device_uhi: string | null
          expires_at: string
          id: string
          ip_address: string | null
          last_collect_at: string | null
          last_hint_code: string | null
          ocsp_response: string | null
          order_ref: string
          signature: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          cached_session_data?: Json | null
          cached_user_data?: Json | null
          completed_at?: string | null
          created_at?: string | null
          device_id?: string | null
          device_ip?: string | null
          device_uhi?: string | null
          expires_at: string
          id?: string
          ip_address?: string | null
          last_collect_at?: string | null
          last_hint_code?: string | null
          ocsp_response?: string | null
          order_ref: string
          signature?: string | null
          status: string
          user_id?: string | null
        }
        Update: {
          cached_session_data?: Json | null
          cached_user_data?: Json | null
          completed_at?: string | null
          created_at?: string | null
          device_id?: string | null
          device_ip?: string | null
          device_uhi?: string | null
          expires_at?: string
          id?: string
          ip_address?: string | null
          last_collect_at?: string | null
          last_hint_code?: string | null
          ocsp_response?: string | null
          order_ref?: string
          signature?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      bids: {
        Row: {
          contact_method:
            | Database["public"]["Enums"]["contact_method_enum"]
            | null
          created_at: string | null
          has_loan_promise: string | null
          id: string
          location_id: string
          message: string | null
          move_in_timeline: string | null
          must_sell_first: boolean | null
          price: number | null
          price_max: number | null
          price_min: number | null
          status: string | null
          user_id: string
          watch_id: string | null
        }
        Insert: {
          contact_method?:
            | Database["public"]["Enums"]["contact_method_enum"]
            | null
          created_at?: string | null
          has_loan_promise?: string | null
          id?: string
          location_id: string
          message?: string | null
          move_in_timeline?: string | null
          must_sell_first?: boolean | null
          price?: number | null
          price_max?: number | null
          price_min?: number | null
          status?: string | null
          user_id: string
          watch_id?: string | null
        }
        Update: {
          contact_method?:
            | Database["public"]["Enums"]["contact_method_enum"]
            | null
          created_at?: string | null
          has_loan_promise?: string | null
          id?: string
          location_id?: string
          message?: string | null
          move_in_timeline?: string | null
          must_sell_first?: boolean | null
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
      broker_applications: {
        Row: {
          bio: string | null
          company_name: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          license_number: string | null
          phone: string | null
          status: string
        }
        Insert: {
          bio?: string | null
          company_name?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          license_number?: string | null
          phone?: string | null
          status?: string
        }
        Update: {
          bio?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          license_number?: string | null
          phone?: string | null
          status?: string
        }
        Relationships: []
      }
      brokers: {
        Row: {
          action_text: string | null
          company_name: string
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          region: string | null
          status: string | null
        }
        Insert: {
          action_text?: string | null
          company_name: string
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          region?: string | null
          status?: string | null
        }
        Update: {
          action_text?: string | null
          company_name?: string
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          region?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brokers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
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
          location_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_message?: string | null
          last_message_at?: string | null
          location_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_message?: string | null
          last_message_at?: string | null
          location_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chats_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      location_claims: {
        Row: {
          claim_type: string | null
          created_at: string | null
          id: string
          location_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          user_id: string
          verification_method: string | null
        }
        Insert: {
          claim_type?: string | null
          created_at?: string | null
          id?: string
          location_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          user_id: string
          verification_method?: string | null
        }
        Update: {
          claim_type?: string | null
          created_at?: string | null
          id?: string
          location_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          user_id?: string
          verification_method?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "location_claims_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_claims_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          altitude: number | null
          city: string | null
          country: string | null
          created_at: string | null
          estimated_value_max: number | null
          estimated_value_min: number | null
          formatted_address: string
          heading: number | null
          id: string
          latitude: number | null
          longitude: number | null
          place_id: string
          postal_code: string | null
          property_type:
            | Database["public"]["Enums"]["property_type_enum"]
            | null
          range: number | null
          region: string | null
          rooms: number | null
          street: string | null
          street_number: string | null
          tilt: number | null
        }
        Insert: {
          altitude?: number | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          estimated_value_max?: number | null
          estimated_value_min?: number | null
          formatted_address: string
          heading?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          place_id: string
          postal_code?: string | null
          property_type?:
            | Database["public"]["Enums"]["property_type_enum"]
            | null
          range?: number | null
          region?: string | null
          rooms?: number | null
          street?: string | null
          street_number?: string | null
          tilt?: number | null
        }
        Update: {
          altitude?: number | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          estimated_value_max?: number | null
          estimated_value_min?: number | null
          formatted_address?: string
          heading?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          place_id?: string
          postal_code?: string | null
          property_type?:
            | Database["public"]["Enums"]["property_type_enum"]
            | null
          range?: number | null
          region?: string | null
          rooms?: number | null
          street?: string | null
          street_number?: string | null
          tilt?: number | null
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
      postcard_orders: {
        Row: {
          admin_note: string | null
          amount: number
          bid_id: string | null
          created_at: string
          currency: string
          id: string
          location_id: string
          paid_at: string | null
          price_max: number
          price_min: number
          qr_token: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["postcard_order_status"]
          stripe_charge_id: string | null
          stripe_payment_intent_id: string | null
          updated_at: string
          user_id: string
          watch_id: string | null
        }
        Insert: {
          admin_note?: string | null
          amount?: number
          bid_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          location_id: string
          paid_at?: string | null
          price_max: number
          price_min: number
          qr_token?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["postcard_order_status"]
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id: string
          watch_id?: string | null
        }
        Update: {
          admin_note?: string | null
          amount?: number
          bid_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          location_id?: string
          paid_at?: string | null
          price_max?: number
          price_min?: number
          qr_token?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["postcard_order_status"]
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id?: string
          watch_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "postcard_orders_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: false
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "postcard_orders_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "postcard_orders_watch_id_fkey"
            columns: ["watch_id"]
            isOneToOne: false
            referencedRelation: "watches"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bankid_issue_date: string | null
          bankid_verified: boolean | null
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_bankid_device_ip: string | null
          last_name: string | null
          login_provider: Database["public"]["Enums"]["login_provider"] | null
          onboarding_completed: boolean | null
          onboarding_completed_at: string | null
          personnummer: string | null
          phone: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          updated_at: string | null
          username: string | null
          verified_at: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bankid_issue_date?: string | null
          bankid_verified?: boolean | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id: string
          last_bankid_device_ip?: string | null
          last_name?: string | null
          login_provider?: Database["public"]["Enums"]["login_provider"] | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          personnummer?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
          username?: string | null
          verified_at?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bankid_issue_date?: string | null
          bankid_verified?: boolean | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_bankid_device_ip?: string | null
          last_name?: string | null
          login_provider?: Database["public"]["Enums"]["login_provider"] | null
          onboarding_completed?: boolean | null
          onboarding_completed_at?: string | null
          personnummer?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
          username?: string | null
          verified_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      push_notification_events: {
        Row: {
          actor_user_id: string | null
          attempts: number
          body: string
          created_at: string
          data: Json
          id: string
          last_error: string | null
          processed_at: string | null
          recipient_user_id: string
          status: string
          title: string
          type: string
        }
        Insert: {
          actor_user_id?: string | null
          attempts?: number
          body: string
          created_at?: string
          data?: Json
          id?: string
          last_error?: string | null
          processed_at?: string | null
          recipient_user_id: string
          status?: string
          title: string
          type: string
        }
        Update: {
          actor_user_id?: string | null
          attempts?: number
          body?: string
          created_at?: string
          data?: Json
          id?: string
          last_error?: string | null
          processed_at?: string | null
          recipient_user_id?: string
          status?: string
          title?: string
          type?: string
        }
        Relationships: []
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
      user_push_tokens: {
        Row: {
          created_at: string
          device_id: string | null
          device_name: string | null
          expo_push_token: string
          id: string
          is_active: boolean
          platform: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_id?: string | null
          device_name?: string | null
          expo_push_token: string
          id?: string
          is_active?: boolean
          platform?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_id?: string | null
          device_name?: string | null
          expo_push_token?: string
          id?: string
          is_active?: boolean
          platform?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      watches: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          created_at: string | null
          id: string
          location_id: string
          scope: string
          status: string
          target_property_type:
            | Database["public"]["Enums"]["property_type_enum"]
            | null
          target_rooms: number[] | null
          user_id: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          id?: string
          location_id: string
          scope: string
          status?: string
          target_property_type?:
            | Database["public"]["Enums"]["property_type_enum"]
            | null
          target_rooms?: number[] | null
          user_id: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          id?: string
          location_id?: string
          scope?: string
          status?: string
          target_property_type?:
            | Database["public"]["Enums"]["property_type_enum"]
            | null
          target_rooms?: number[] | null
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
      claim_location: {
        Args: {
          p_city: string
          p_formatted_address: string
          p_lat: number
          p_lng: number
          p_place_id: string
          p_street: string
          p_street_number: string
          p_user_id: string
          p_verification_method: string
        }
        Returns: string
      }
      cleanup_expired_bankid_sessions: { Args: never; Returns: undefined }
      create_chat_with_participant: {
        Args: { other_user_id: string; p_location_id: string }
        Returns: string
      }
      create_chat_with_participants: {
        Args: { p_other_user_ids: string[] }
        Returns: string
      }
      deactivate_current_push_token: {
        Args: { p_device_id: string }
        Returns: undefined
      }
      delete_user_account: { Args: never; Returns: undefined }
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
      get_claimed_locations_with_bidders: {
        Args: { p_owner_id: string }
        Returns: {
          bidders: Json
          city: string
          country: string
          created_at: string
          formatted_address: string
          id: string
          latitude: number
          longitude: number
          place_id: string
          postal_code: string
          region: string
          street: string
          street_number: string
        }[]
      }
      get_common_chat_id: {
        Args: { p_location_id: string; user_id_1: string; user_id_2: string }
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
          location_id: string
          participants: Json
          rooms: number
          street: string
          street_number: string
          unread_count: number
        }[]
      }
      get_users_with_auth: {
        Args: never
        Returns: {
          avatar_url: string
          email: string
          full_name: string
          id: string
          last_login: string
          registered_at: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          username: string
          website: string
        }[]
      }
      increment_unread: {
        Args: { p_chat_id: string; p_sender_id: string }
        Returns: undefined
      }
      push_location_label: { Args: { p_location_id: string }; Returns: string }
      push_profile_name: { Args: { p_user_id: string }; Returns: string }
      register_user_push_token: {
        Args: {
          p_device_id?: string
          p_device_name?: string
          p_expo_push_token: string
          p_platform?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "user" | "admin" | "super_admin"
      contact_method_enum: "broker" | "direct_post" | "owner_chat"
      login_provider: "bankid" | "google" | "apple" | "email" | "guest"
      postcard_order_status:
        | "pending"
        | "paid"
        | "sent"
        | "failed"
        | "cancelled"
      property_type_enum: "House" | "Apartment" | "Land"
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
      contact_method_enum: ["broker", "direct_post", "owner_chat"],
      login_provider: ["bankid", "google", "apple", "email", "guest"],
      postcard_order_status: ["pending", "paid", "sent", "failed", "cancelled"],
      property_type_enum: ["House", "Apartment", "Land"],
    },
  },
} as const
