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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      ai_agents: {
        Row: {
          configuration: Json | null
          created_at: string | null
          id: string
          last_execution: string | null
          n8n_workflow_id: string | null
          name: string
          performance_metrics: Json | null
          status: Database["public"]["Enums"]["agent_status"]
          success_rate: number | null
          type: Database["public"]["Enums"]["agent_type"]
          updated_at: string | null
        }
        Insert: {
          configuration?: Json | null
          created_at?: string | null
          id?: string
          last_execution?: string | null
          n8n_workflow_id?: string | null
          name: string
          performance_metrics?: Json | null
          status?: Database["public"]["Enums"]["agent_status"]
          success_rate?: number | null
          type: Database["public"]["Enums"]["agent_type"]
          updated_at?: string | null
        }
        Update: {
          configuration?: Json | null
          created_at?: string | null
          id?: string
          last_execution?: string | null
          n8n_workflow_id?: string | null
          name?: string
          performance_metrics?: Json | null
          status?: Database["public"]["Enums"]["agent_status"]
          success_rate?: number | null
          type?: Database["public"]["Enums"]["agent_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      alerts: {
        Row: {
          asset_id: string | null
          confidence: number | null
          created_at: string | null
          description: string | null
          id: string
          priority: Database["public"]["Enums"]["work_order_priority"]
          resolved_at: string | null
          source: string
          status: string
          title: string
        }
        Insert: {
          asset_id?: string | null
          confidence?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["work_order_priority"]
          resolved_at?: string | null
          source: string
          status?: string
          title: string
        }
        Update: {
          asset_id?: string | null
          confidence?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["work_order_priority"]
          resolved_at?: string | null
          source?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          created_at: string | null
          id: string
          last_maintenance: string | null
          location_x: number | null
          location_y: number | null
          name: string
          next_maintenance: string | null
          oee: number | null
          plant_id: string | null
          specifications: Json | null
          status: Database["public"]["Enums"]["asset_status"]
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_maintenance?: string | null
          location_x?: number | null
          location_y?: number | null
          name: string
          next_maintenance?: string | null
          oee?: number | null
          plant_id?: string | null
          specifications?: Json | null
          status?: Database["public"]["Enums"]["asset_status"]
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_maintenance?: string | null
          location_x?: number | null
          location_y?: number | null
          name?: string
          next_maintenance?: string | null
          oee?: number | null
          plant_id?: string | null
          specifications?: Json | null
          status?: Database["public"]["Enums"]["asset_status"]
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
        ]
      }
      deliveries: {
        Row: {
          actual_cost: number | null
          actual_date: string | null
          created_at: string | null
          destination_address: string | null
          estimated_cost: number | null
          id: string
          optimized_route: Json | null
          scheduled_date: string | null
          status: string
          supplier_id: string | null
          tracking_number: string | null
          updated_at: string | null
        }
        Insert: {
          actual_cost?: number | null
          actual_date?: string | null
          created_at?: string | null
          destination_address?: string | null
          estimated_cost?: number | null
          id?: string
          optimized_route?: Json | null
          scheduled_date?: string | null
          status?: string
          supplier_id?: string | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_cost?: number | null
          actual_date?: string | null
          created_at?: string | null
          destination_address?: string | null
          estimated_cost?: number | null
          id?: string
          optimized_route?: Json | null
          scheduled_date?: string | null
          status?: string
          supplier_id?: string | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          category: string | null
          created_at: string | null
          current_stock: number | null
          id: string
          location: string | null
          max_stock: number | null
          min_stock: number | null
          name: string
          sku: string
          supplier_id: string | null
          unit_price: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          current_stock?: number | null
          id?: string
          location?: string | null
          max_stock?: number | null
          min_stock?: number | null
          name: string
          sku: string
          supplier_id?: string | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          current_stock?: number | null
          id?: string
          location?: string | null
          max_stock?: number | null
          min_stock?: number | null
          name?: string
          sku?: string
          supplier_id?: string | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type?: string
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      plants: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          location: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          location: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      production_lines: {
        Row: {
          created_at: string | null
          id: string
          micro_stoppages: number | null
          name: string
          plant_id: string | null
          quality_rate: number | null
          status: string
          target_throughput: number | null
          throughput: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          micro_stoppages?: number | null
          name: string
          plant_id?: string | null
          quality_rate?: number | null
          status?: string
          target_throughput?: number | null
          throughput?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          micro_stoppages?: number | null
          name?: string
          plant_id?: string | null
          quality_rate?: number | null
          status?: string
          target_throughput?: number | null
          throughput?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "production_lines_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          department: string | null
          email: string
          id: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email: string
          id: string
          name: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      quality_incidents: {
        Row: {
          created_at: string | null
          defect_type: string
          description: string | null
          id: string
          image_url: string | null
          line_id: string | null
          resolution_notes: string | null
          resolved: boolean | null
          resolved_at: string | null
          severity: string
        }
        Insert: {
          created_at?: string | null
          defect_type: string
          description?: string | null
          id?: string
          image_url?: string | null
          line_id?: string | null
          resolution_notes?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          severity?: string
        }
        Update: {
          created_at?: string | null
          defect_type?: string
          description?: string | null
          id?: string
          image_url?: string | null
          line_id?: string | null
          resolution_notes?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "quality_incidents_line_id_fkey"
            columns: ["line_id"]
            isOneToOne: false
            referencedRelation: "production_lines"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          id: string
          name: string
          performance_rating: number | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          name: string
          performance_rating?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          name?: string
          performance_rating?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      work_orders: {
        Row: {
          actual_hours: number | null
          asset_id: string | null
          assigned_to: string | null
          completed_date: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          estimated_hours: number | null
          id: string
          notes: string | null
          priority: Database["public"]["Enums"]["work_order_priority"]
          scheduled_date: string | null
          status: Database["public"]["Enums"]["work_order_status"]
          title: string
          updated_at: string | null
        }
        Insert: {
          actual_hours?: number | null
          asset_id?: string | null
          assigned_to?: string | null
          completed_date?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_hours?: number | null
          id?: string
          notes?: string | null
          priority?: Database["public"]["Enums"]["work_order_priority"]
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["work_order_status"]
          title: string
          updated_at?: string | null
        }
        Update: {
          actual_hours?: number | null
          asset_id?: string | null
          assigned_to?: string | null
          completed_date?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_hours?: number | null
          id?: string
          notes?: string | null
          priority?: Database["public"]["Enums"]["work_order_priority"]
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["work_order_status"]
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_orders_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      agent_status: "active" | "inactive" | "error" | "maintenance"
      agent_type:
        | "route_optimization"
        | "inventory_management"
        | "predictive_maintenance"
        | "quality_control"
        | "energy_optimization"
      asset_status: "healthy" | "warning" | "critical" | "offline"
      user_role:
        | "plant_director"
        | "maintenance_manager"
        | "production_supervisor"
        | "operator"
        | "admin"
      work_order_priority: "low" | "medium" | "high" | "critical"
      work_order_status: "pending" | "in_progress" | "completed" | "cancelled"
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
      agent_status: ["active", "inactive", "error", "maintenance"],
      agent_type: [
        "route_optimization",
        "inventory_management",
        "predictive_maintenance",
        "quality_control",
        "energy_optimization",
      ],
      asset_status: ["healthy", "warning", "critical", "offline"],
      user_role: [
        "plant_director",
        "maintenance_manager",
        "production_supervisor",
        "operator",
        "admin",
      ],
      work_order_priority: ["low", "medium", "high", "critical"],
      work_order_status: ["pending", "in_progress", "completed", "cancelled"],
    },
  },
} as const
