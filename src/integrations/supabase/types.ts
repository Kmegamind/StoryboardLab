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
      project_assets: {
        Row: {
          asset_name: string
          asset_type: string
          created_at: string
          description: string | null
          id: string
          project_id: string
          reference_image_url: string | null
          reference_token: string | null
          updated_at: string
        }
        Insert: {
          asset_name: string
          asset_type: string
          created_at?: string
          description?: string | null
          id?: string
          project_id: string
          reference_image_url?: string | null
          reference_token?: string | null
          updated_at?: string
        }
        Update: {
          asset_name?: string
          asset_type?: string
          created_at?: string
          description?: string | null
          id?: string
          project_id?: string
          reference_image_url?: string | null
          reference_token?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_assets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_consistency_prompts: {
        Row: {
          asset_name: string
          asset_type: string
          consistency_prompt: string
          created_at: string
          id: string
          project_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          asset_name: string
          asset_type: string
          consistency_prompt: string
          created_at?: string
          id?: string
          project_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          asset_name?: string
          asset_type?: string
          consistency_prompt?: string
          created_at?: string
          id?: string
          project_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_consistency_prompts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          director_output_json: string | null
          id: string
          plot: string | null
          screenwriter_output: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          director_output_json?: string | null
          id?: string
          plot?: string | null
          screenwriter_output?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          director_output_json?: string | null
          id?: string
          plot?: string | null
          screenwriter_output?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      shot_perspectives: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          perspective_name: string
          prompt_modifier: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          perspective_name: string
          prompt_modifier: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          perspective_name?: string
          prompt_modifier?: string
          updated_at?: string
        }
        Relationships: []
      }
      shot_prompts: {
        Row: {
          created_at: string
          id: string
          is_final: boolean
          prompt_text: string
          shot_id: string
          updated_at: string
          user_id: string
          version_number: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_final?: boolean
          prompt_text: string
          shot_id: string
          updated_at?: string
          user_id: string
          version_number?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_final?: boolean
          prompt_text?: string
          shot_id?: string
          updated_at?: string
          user_id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "shot_prompts_shot_id_fkey"
            columns: ["shot_id"]
            isOneToOne: false
            referencedRelation: "structured_shots"
            referencedColumns: ["id"]
          },
        ]
      }
      structured_shots: {
        Row: {
          camera_movement: string | null
          created_at: string
          dialogue: string | null
          director_notes: string | null
          estimated_duration: string | null
          id: string
          is_archived: boolean
          key_props: string | null
          parent_shot_id: string | null
          perspective_name: string | null
          perspective_type: string
          project_id: string | null
          scene_content: string
          shot_number: string | null
          shot_type: string | null
          sound_music: string | null
          updated_at: string
          user_id: string | null
          visual_style: string | null
        }
        Insert: {
          camera_movement?: string | null
          created_at?: string
          dialogue?: string | null
          director_notes?: string | null
          estimated_duration?: string | null
          id?: string
          is_archived?: boolean
          key_props?: string | null
          parent_shot_id?: string | null
          perspective_name?: string | null
          perspective_type?: string
          project_id?: string | null
          scene_content: string
          shot_number?: string | null
          shot_type?: string | null
          sound_music?: string | null
          updated_at?: string
          user_id?: string | null
          visual_style?: string | null
        }
        Update: {
          camera_movement?: string | null
          created_at?: string
          dialogue?: string | null
          director_notes?: string | null
          estimated_duration?: string | null
          id?: string
          is_archived?: boolean
          key_props?: string | null
          parent_shot_id?: string | null
          perspective_name?: string | null
          perspective_type?: string
          project_id?: string | null
          scene_content?: string
          shot_number?: string | null
          shot_type?: string | null
          sound_music?: string | null
          updated_at?: string
          user_id?: string | null
          visual_style?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "structured_shots_parent_shot_id_fkey"
            columns: ["parent_shot_id"]
            isOneToOne: false
            referencedRelation: "structured_shots"
            referencedColumns: ["id"]
          },
        ]
      }
      user_api_keys: {
        Row: {
          api_key_encrypted: string
          created_at: string
          id: string
          provider: string
          updated_at: string
          user_id: string
        }
        Insert: {
          api_key_encrypted: string
          created_at?: string
          id?: string
          provider?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          api_key_encrypted?: string
          created_at?: string
          id?: string
          provider?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
