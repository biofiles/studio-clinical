export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      consent_signatures: {
        Row: {
          consent_type: Database["public"]["Enums"]["consent_type"]
          consent_version: string
          created_at: string
          id: string
          investigator_auth_timestamp: string | null
          investigator_full_name: string | null
          investigator_ip_address: unknown | null
          investigator_meaning_acknowledged: boolean | null
          investigator_signature_data: string | null
          investigator_signed_at: string | null
          investigator_user_id: string | null
          participant_auth_timestamp: string | null
          participant_full_name: string | null
          participant_id: string
          participant_ip_address: unknown | null
          participant_signature_data: string | null
          participant_signed_at: string | null
          signature_meaning_acknowledged: boolean
          status: Database["public"]["Enums"]["consent_signature_status"]
          study_id: string
          updated_at: string
        }
        Insert: {
          consent_type?: Database["public"]["Enums"]["consent_type"]
          consent_version?: string
          created_at?: string
          id?: string
          investigator_auth_timestamp?: string | null
          investigator_full_name?: string | null
          investigator_ip_address?: unknown | null
          investigator_meaning_acknowledged?: boolean | null
          investigator_signature_data?: string | null
          investigator_signed_at?: string | null
          investigator_user_id?: string | null
          participant_auth_timestamp?: string | null
          participant_full_name?: string | null
          participant_id: string
          participant_ip_address?: unknown | null
          participant_signature_data?: string | null
          participant_signed_at?: string | null
          signature_meaning_acknowledged?: boolean
          status?: Database["public"]["Enums"]["consent_signature_status"]
          study_id: string
          updated_at?: string
        }
        Update: {
          consent_type?: Database["public"]["Enums"]["consent_type"]
          consent_version?: string
          created_at?: string
          id?: string
          investigator_auth_timestamp?: string | null
          investigator_full_name?: string | null
          investigator_ip_address?: unknown | null
          investigator_meaning_acknowledged?: boolean | null
          investigator_signature_data?: string | null
          investigator_signed_at?: string | null
          investigator_user_id?: string | null
          participant_auth_timestamp?: string | null
          participant_full_name?: string | null
          participant_id?: string
          participant_ip_address?: unknown | null
          participant_signature_data?: string | null
          participant_signed_at?: string | null
          signature_meaning_acknowledged?: boolean
          status?: Database["public"]["Enums"]["consent_signature_status"]
          study_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consent_signatures_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consent_signatures_study_id_fkey"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "studies"
            referencedColumns: ["id"]
          },
        ]
      }
      participants: {
        Row: {
          address: string | null
          arm: string | null
          city: string | null
          completion_date: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          enrollment_date: string | null
          first_name: string | null
          gender: string | null
          id: string
          last_name: string | null
          state: string | null
          status: string
          study_id: string
          subject_id: string
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          arm?: string | null
          city?: string | null
          completion_date?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          enrollment_date?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          last_name?: string | null
          state?: string | null
          status?: string
          study_id: string
          subject_id: string
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          arm?: string | null
          city?: string | null
          completion_date?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          enrollment_date?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          last_name?: string | null
          state?: string | null
          status?: string
          study_id?: string
          subject_id?: string
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "participants_study_id_fkey"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "studies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      questionnaire_responses: {
        Row: {
          answers: Json | null
          created_at: string
          id: string
          participant_id: string
          questionnaire_id: string
          status: string
          submitted_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          answers?: Json | null
          created_at?: string
          id?: string
          participant_id: string
          questionnaire_id: string
          status?: string
          submitted_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          answers?: Json | null
          created_at?: string
          id?: string
          participant_id?: string
          questionnaire_id?: string
          status?: string
          submitted_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questionnaire_responses_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      studies: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          phase: string | null
          protocol: string
          sponsor: string | null
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          phase?: string | null
          protocol: string
          sponsor?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          phase?: string | null
          protocol?: string
          sponsor?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      study_results_signups: {
        Row: {
          created_at: string
          email: string
          id: string
          participant_id: string | null
          signed_up_at: string
          study_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          participant_id?: string | null
          signed_up_at?: string
          study_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          participant_id?: string | null
          signed_up_at?: string
          study_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_results_signups_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_results_signups_study_id_fkey"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "studies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_log: {
        Row: {
          activity_type: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_invitations: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          full_name: string | null
          id: string
          invited_by: string
          role: Database["public"]["Enums"]["app_role"]
          status: string
          study_id: string | null
          token: string
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          full_name?: string | null
          id?: string
          invited_by: string
          role: Database["public"]["Enums"]["app_role"]
          status?: string
          study_id?: string | null
          token?: string
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          full_name?: string | null
          id?: string
          invited_by?: string
          role?: Database["public"]["Enums"]["app_role"]
          status?: string
          study_id?: string | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_invitations_study_id_fkey"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "studies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          created_at: string
          id: string
          permissions: Json | null
          role: Database["public"]["Enums"]["app_role"]
          status: string | null
          study_id: string | null
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string
          id?: string
          permissions?: Json | null
          role: Database["public"]["Enums"]["app_role"]
          status?: string | null
          study_id?: string | null
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string
          id?: string
          permissions?: Json | null
          role?: Database["public"]["Enums"]["app_role"]
          status?: string | null
          study_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_study_id_fkey"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "studies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_invitation_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_pending_consent_signatures: {
        Args: { investigator_user_id: string; check_study_id?: string }
        Returns: {
          consent_id: string
          participant_id: string
          participant_name: string
          subject_id: string
          consent_type: Database["public"]["Enums"]["consent_type"]
          participant_signed_at: string
          days_pending: number
        }[]
      }
      get_user_role: {
        Args: { check_user_id: string; check_study_id?: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          check_user_id: string
          check_role: Database["public"]["Enums"]["app_role"]
          check_study_id?: string
        }
        Returns: boolean
      }
      log_security_event: {
        Args: {
          event_type: string
          event_details?: Json
          user_id_param?: string
        }
        Returns: undefined
      }
      log_user_activity: {
        Args: { user_id: string; activity_type: string; details?: Json }
        Returns: undefined
      }
      sanitize_text: {
        Args: { input_text: string }
        Returns: string
      }
      validate_email: {
        Args: { email_input: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "participant" | "investigator" | "cro_sponsor" | "admin"
      consent_signature_status:
        | "participant_signed"
        | "investigator_signed"
        | "complete"
      consent_type:
        | "main_icf"
        | "pharmacokinetics"
        | "biomarkers"
        | "pregnant_partner"
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
      app_role: ["participant", "investigator", "cro_sponsor", "admin"],
      consent_signature_status: [
        "participant_signed",
        "investigator_signed",
        "complete",
      ],
      consent_type: [
        "main_icf",
        "pharmacokinetics",
        "biomarkers",
        "pregnant_partner",
      ],
    },
  },
} as const
