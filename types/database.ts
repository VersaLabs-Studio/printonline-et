export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null;
          description: string | null;
          display_order: number | null;
          id: string;
          image_url: string | null;
          is_active: boolean | null;
          meta_description: string | null;
          meta_title: string | null;
          name: string;
          slug: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          display_order?: number | null;
          id?: string;
          image_url?: string | null;
          is_active?: boolean | null;
          meta_description?: string | null;
          meta_title?: string | null;
          name: string;
          slug: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          display_order?: number | null;
          id?: string;
          image_url?: string | null;
          is_active?: boolean | null;
          meta_description?: string | null;
          meta_title?: string | null;
          name?: string;
          slug?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      customer_profiles: {
        Row: {
          address_line1: string | null;
          address_line2: string | null;
          auth_user_id: string;
          city: string | null;
          company_name: string | null;
          country: string | null;
          created_at: string | null;
          email: string;
          full_name: string;
          id: string;
          is_active: boolean | null;
          phone: string | null;
          sub_city: string | null;
          tin_number: string | null;
          updated_at: string | null;
          woreda: string | null;
        };
        Insert: {
          address_line1?: string | null;
          address_line2?: string | null;
          auth_user_id: string;
          city?: string | null;
          company_name?: string | null;
          country?: string | null;
          created_at?: string | null;
          email: string;
          full_name: string;
          id?: string;
          is_active?: boolean | null;
          phone?: string | null;
          sub_city?: string | null;
          tin_number?: string | null;
          updated_at?: string | null;
          woreda?: string | null;
        };
        Update: {
          address_line1?: string | null;
          address_line2?: string | null;
          auth_user_id?: string;
          city?: string | null;
          company_name?: string | null;
          country?: string | null;
          created_at?: string | null;
          email?: string;
          full_name?: string;
          id?: string;
          is_active?: boolean | null;
          phone?: string | null;
          sub_city?: string | null;
          tin_number?: string | null;
          updated_at?: string | null;
          woreda?: string | null;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          category: string | null;
          created_at: string | null;
          design_file_name: string | null;
          design_file_size: number | null;
          design_file_url: string | null;
          id: string;
          line_total: number;
          order_id: string;
          product_id: string | null;
          product_image: string | null;
          product_name: string;
          product_slug: string | null;
          quantity: number;
          selected_options: Json | null;
          unit_price: number;
        };
        Insert: {
          category?: string | null;
          created_at?: string | null;
          design_file_name?: string | null;
          design_file_size?: number | null;
          design_file_url?: string | null;
          id?: string;
          line_total: number;
          order_id: string;
          product_id?: string | null;
          product_image?: string | null;
          product_name: string;
          product_slug?: string | null;
          quantity?: number;
          selected_options?: Json | null;
          unit_price: number;
        };
        Update: {
          category?: string | null;
          created_at?: string | null;
          design_file_name?: string | null;
          design_file_size?: number | null;
          design_file_url?: string | null;
          id?: string;
          line_total?: number;
          order_id?: string;
          product_id?: string | null;
          product_image?: string | null;
          product_name?: string;
          product_slug?: string | null;
          quantity?: number;
          selected_options?: Json | null;
          unit_price?: number;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          confirmation_email_sent: boolean | null;
          created_at: string | null;
          currency: string;
          customer_email: string;
          customer_id: string | null;
          customer_name: string;
          customer_phone: string | null;
          customer_tin: string | null;
          delivery_address: string | null;
          delivery_city: string | null;
          delivery_fee: number | null;
          delivery_sub_city: string | null;
          id: string;
          internal_notes: string | null;
          order_number: string;
          payment_method: string | null;
          payment_status: string | null;
          special_instructions: string | null;
          status: string;
          status_history: Json | null;
          subtotal: number;
          tax_amount: number | null;
          terms_accepted: boolean | null;
          terms_accepted_at: string | null;
          total_amount: number;
          updated_at: string | null;
        };
        Insert: {
          confirmation_email_sent?: boolean | null;
          created_at?: string | null;
          currency?: string;
          customer_email: string;
          customer_id?: string | null;
          customer_name: string;
          customer_phone?: string | null;
          customer_tin?: string | null;
          delivery_address?: string | null;
          delivery_city?: string | null;
          delivery_fee?: number | null;
          delivery_sub_city?: string | null;
          id?: string;
          internal_notes?: string | null;
          order_number: string;
          payment_method?: string | null;
          payment_status?: string | null;
          special_instructions?: string | null;
          status?: string;
          status_history?: Json | null;
          subtotal?: number;
          tax_amount?: number | null;
          terms_accepted?: boolean | null;
          terms_accepted_at?: string | null;
          total_amount?: number;
          updated_at?: string | null;
        };
        Update: {
          confirmation_email_sent?: boolean | null;
          created_at?: string | null;
          currency?: string;
          customer_email?: string;
          customer_id?: string | null;
          customer_name?: string;
          customer_phone?: string | null;
          customer_tin?: string | null;
          delivery_address?: string | null;
          delivery_city?: string | null;
          delivery_fee?: number | null;
          delivery_sub_city?: string | null;
          id?: string;
          internal_notes?: string | null;
          order_number?: string;
          payment_method?: string | null;
          payment_status?: string | null;
          special_instructions?: string | null;
          status?: string;
          status_history?: Json | null;
          subtotal?: number;
          tax_amount?: number | null;
          terms_accepted?: boolean | null;
          terms_accepted_at?: string | null;
          total_amount?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customer_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      product_images: {
        Row: {
          alt_text: string | null;
          created_at: string | null;
          display_order: number | null;
          id: string;
          image_url: string;
          is_primary: boolean | null;
          product_id: string;
        };
        Insert: {
          alt_text?: string | null;
          created_at?: string | null;
          display_order?: number | null;
          id?: string;
          image_url: string;
          is_primary?: boolean | null;
          product_id: string;
        };
        Update: {
          alt_text?: string | null;
          created_at?: string | null;
          display_order?: number | null;
          id?: string;
          image_url?: string;
          is_primary?: boolean | null;
          product_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_option_values: {
        Row: {
          description: string | null;
          display_order: number | null;
          group_name: string | null;
          id: string;
          is_active: boolean | null;
          is_default: boolean | null;
          label: string;
          metadata: Json | null;
          option_id: string;
          price_amount: number | null;
          price_type: string | null;
          value: string;
        };
        Insert: {
          description?: string | null;
          display_order?: number | null;
          group_name?: string | null;
          id?: string;
          is_active?: boolean | null;
          is_default?: boolean | null;
          label: string;
          metadata?: Json | null;
          option_id: string;
          price_amount?: number | null;
          price_type?: string | null;
          value: string;
        };
        Update: {
          description?: string | null;
          display_order?: number | null;
          group_name?: string | null;
          id?: string;
          is_active?: boolean | null;
          is_default?: boolean | null;
          label?: string;
          metadata?: Json | null;
          option_id?: string;
          price_amount?: number | null;
          price_type?: string | null;
          value?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_option_values_option_id_fkey";
            columns: ["option_id"];
            isOneToOne: false;
            referencedRelation: "product_options";
            referencedColumns: ["id"];
          },
        ];
      };
      product_options: {
        Row: {
          depends_on_option: string | null;
          depends_on_value: string | null;
          description: string | null;
          display_order: number | null;
          field_type: string;
          group_label: string | null;
          id: string;
          is_required: boolean | null;
          option_key: string;
          option_label: string;
          product_id: string;
        };
        Insert: {
          depends_on_option?: string | null;
          depends_on_value?: string | null;
          description?: string | null;
          display_order?: number | null;
          field_type?: string;
          group_label?: string | null;
          id?: string;
          is_required?: boolean | null;
          option_key: string;
          option_label: string;
          product_id: string;
        };
        Update: {
          depends_on_option?: string | null;
          depends_on_value?: string | null;
          description?: string | null;
          display_order?: number | null;
          field_type?: string;
          group_label?: string | null;
          id?: string;
          is_required?: boolean | null;
          option_key?: string;
          option_label?: string;
          product_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_options_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          badge: string | null;
          base_price: number;
          category_id: string | null;
          created_at: string | null;
          currency: string;
          description: string | null;
          display_order: number | null;
          features: Json | null;
          form_type: string;
          id: string;
          in_stock: boolean | null;
          is_active: boolean | null;
          meta_description: string | null;
          meta_title: string | null;
          min_order_quantity: number | null;
          name: string;
          short_description: string | null;
          sku: string | null;
          slug: string;
          specifications: Json | null;
          stock_status: string;
          updated_at: string | null;
        };
        Insert: {
          badge?: string | null;
          base_price?: number;
          category_id?: string | null;
          created_at?: string | null;
          currency?: string;
          description?: string | null;
          display_order?: number | null;
          features?: Json | null;
          form_type?: string;
          id?: string;
          in_stock?: boolean | null;
          is_active?: boolean | null;
          meta_description?: string | null;
          meta_title?: string | null;
          min_order_quantity?: number | null;
          name: string;
          short_description?: string | null;
          sku?: string | null;
          slug: string;
          specifications?: Json | null;
          stock_status?: string;
          updated_at?: string | null;
        };
        Update: {
          badge?: string | null;
          base_price?: number;
          category_id?: string | null;
          created_at?: string | null;
          currency?: string;
          description?: string | null;
          display_order?: number | null;
          features?: Json | null;
          form_type?: string;
          id?: string;
          in_stock?: boolean | null;
          is_active?: boolean | null;
          meta_description?: string | null;
          meta_title?: string | null;
          min_order_quantity?: number | null;
          name?: string;
          short_description?: string | null;
          sku?: string | null;
          slug?: string;
          specifications?: Json | null;
          stock_status?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      generate_slug: { Args: { input: string }; Returns: string };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;

// ============================================================
// CONVENIENCE TYPE ALIASES
// ⚠️ Keep this section when re-generating types with:
//    npx supabase gen types typescript --project-id ijwfgwjndatqzjbbhhpz | Out-File -FilePath types/database.ts -Encoding utf8
//    Then re-append this block below the generated code.
// ============================================================

// Row types (what you get back from SELECT)
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductImage =
  Database["public"]["Tables"]["product_images"]["Row"];
export type ProductOption =
  Database["public"]["Tables"]["product_options"]["Row"];
export type ProductOptionValue =
  Database["public"]["Tables"]["product_option_values"]["Row"];
export type CustomerProfile =
  Database["public"]["Tables"]["customer_profiles"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];

// Insert types (what you pass to INSERT)
export type CategoryInsert =
  Database["public"]["Tables"]["categories"]["Insert"];
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
export type ProductImageInsert =
  Database["public"]["Tables"]["product_images"]["Insert"];
export type ProductOptionInsert =
  Database["public"]["Tables"]["product_options"]["Insert"];
export type ProductOptionValueInsert =
  Database["public"]["Tables"]["product_option_values"]["Insert"];
export type CustomerProfileInsert =
  Database["public"]["Tables"]["customer_profiles"]["Insert"];
export type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];
export type OrderItemInsert =
  Database["public"]["Tables"]["order_items"]["Insert"];

// Update types (what you pass to UPDATE)
export type CategoryUpdate =
  Database["public"]["Tables"]["categories"]["Update"];
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];
export type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"];
export type CustomerProfileUpdate =
  Database["public"]["Tables"]["customer_profiles"]["Update"];

// ============================================================
// COMPOSITE / JOINED TYPES (for queries with relations)
// ============================================================

/** Product with its category info (from .select('*, category:categories(name, slug)')) */
export type ProductWithCategory = Product & {
  category: Pick<Category, "name" | "slug"> | null;
  product_images?: ProductImage[];
};

/** Product with all related data (detail page) */
export type ProductWithDetails = Product & {
  category: Pick<Category, "name" | "slug"> | null;
  product_images: ProductImage[];
  product_options: (ProductOption & {
    product_option_values: ProductOptionValue[];
  })[];
};

/** Order with its line items */
export type OrderWithItems = Order & {
  order_items: OrderItem[];
};

/** Order status type for type-safe status checks */
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "ready"
  | "delivered"
  | "completed"
  | "cancelled";

/** Stock status type */
export type StockStatus =
  | "in_stock"
  | "low_stock"
  | "out_of_stock"
  | "made_to_order";

/** Price type for option values */
export type PriceType = "fixed" | "percentage" | "multiplier" | "override";
