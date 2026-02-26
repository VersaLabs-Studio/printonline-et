// types/database.ts
// ⚠️ AUTO-GENERATED — DO NOT EDIT MANUALLY
// This file will be replaced by: npx supabase gen types typescript --project-id <id>
// Placeholder until migrations are run and types are generated.

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
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          display_order: number;
          is_active: boolean;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          category_id: string | null;
          description: string | null;
          short_description: string | null;
          base_price: number;
          currency: string;
          sku: string | null;
          badge: string | null;
          form_type: string;
          is_active: boolean;
          in_stock: boolean;
          stock_status: string;
          min_order_quantity: number;
          features: Json;
          specifications: Json;
          meta_title: string | null;
          meta_description: string | null;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          category_id?: string | null;
          description?: string | null;
          short_description?: string | null;
          base_price?: number;
          currency?: string;
          sku?: string | null;
          badge?: string | null;
          form_type?: string;
          is_active?: boolean;
          in_stock?: boolean;
          stock_status?: string;
          min_order_quantity?: number;
          features?: Json;
          specifications?: Json;
          meta_title?: string | null;
          meta_description?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          category_id?: string | null;
          description?: string | null;
          short_description?: string | null;
          base_price?: number;
          currency?: string;
          sku?: string | null;
          badge?: string | null;
          form_type?: string;
          is_active?: boolean;
          in_stock?: boolean;
          stock_status?: string;
          min_order_quantity?: number;
          features?: Json;
          specifications?: Json;
          meta_title?: string | null;
          meta_description?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          image_url: string;
          alt_text: string | null;
          display_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          image_url: string;
          alt_text?: string | null;
          display_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          image_url?: string;
          alt_text?: string | null;
          display_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_options: {
        Row: {
          id: string;
          product_id: string;
          option_key: string;
          option_label: string;
          field_type: string;
          is_required: boolean;
          display_order: number;
          description: string | null;
          group_label: string | null;
          depends_on_option: string | null;
          depends_on_value: string | null;
        };
        Insert: {
          id?: string;
          product_id: string;
          option_key: string;
          option_label: string;
          field_type?: string;
          is_required?: boolean;
          display_order?: number;
          description?: string | null;
          group_label?: string | null;
          depends_on_option?: string | null;
          depends_on_value?: string | null;
        };
        Update: {
          id?: string;
          product_id?: string;
          option_key?: string;
          option_label?: string;
          field_type?: string;
          is_required?: boolean;
          display_order?: number;
          description?: string | null;
          group_label?: string | null;
          depends_on_option?: string | null;
          depends_on_value?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "product_options_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_option_values: {
        Row: {
          id: string;
          option_id: string;
          value: string;
          label: string;
          price_amount: number | null;
          price_type: string;
          group_name: string | null;
          description: string | null;
          display_order: number;
          is_default: boolean;
          is_active: boolean;
          metadata: Json;
        };
        Insert: {
          id?: string;
          option_id: string;
          value: string;
          label: string;
          price_amount?: number | null;
          price_type?: string;
          group_name?: string | null;
          description?: string | null;
          display_order?: number;
          is_default?: boolean;
          is_active?: boolean;
          metadata?: Json;
        };
        Update: {
          id?: string;
          option_id?: string;
          value?: string;
          label?: string;
          price_amount?: number | null;
          price_type?: string;
          group_name?: string | null;
          description?: string | null;
          display_order?: number;
          is_default?: boolean;
          is_active?: boolean;
          metadata?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "product_option_values_option_id_fkey";
            columns: ["option_id"];
            referencedRelation: "product_options";
            referencedColumns: ["id"];
          },
        ];
      };
      customer_profiles: {
        Row: {
          id: string;
          auth_user_id: string;
          full_name: string;
          email: string;
          phone: string | null;
          tin_number: string | null;
          company_name: string | null;
          address_line1: string | null;
          address_line2: string | null;
          city: string;
          sub_city: string | null;
          woreda: string | null;
          country: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_user_id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          tin_number?: string | null;
          company_name?: string | null;
          address_line1?: string | null;
          address_line2?: string | null;
          city?: string;
          sub_city?: string | null;
          woreda?: string | null;
          country?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth_user_id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          tin_number?: string | null;
          company_name?: string | null;
          address_line1?: string | null;
          address_line2?: string | null;
          city?: string;
          sub_city?: string | null;
          woreda?: string | null;
          country?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string | null;
          status: string;
          status_history: Json;
          subtotal: number;
          tax_amount: number;
          delivery_fee: number;
          total_amount: number;
          currency: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string | null;
          customer_tin: string | null;
          delivery_address: string | null;
          delivery_city: string | null;
          delivery_sub_city: string | null;
          special_instructions: string | null;
          internal_notes: string | null;
          terms_accepted: boolean;
          terms_accepted_at: string | null;
          confirmation_email_sent: boolean;
          payment_method: string | null;
          payment_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string;
          customer_id?: string | null;
          status?: string;
          status_history?: Json;
          subtotal?: number;
          tax_amount?: number;
          delivery_fee?: number;
          total_amount?: number;
          currency?: string;
          customer_name: string;
          customer_email: string;
          customer_phone?: string | null;
          customer_tin?: string | null;
          delivery_address?: string | null;
          delivery_city?: string | null;
          delivery_sub_city?: string | null;
          special_instructions?: string | null;
          internal_notes?: string | null;
          terms_accepted?: boolean;
          terms_accepted_at?: string | null;
          confirmation_email_sent?: boolean;
          payment_method?: string | null;
          payment_status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_id?: string | null;
          status?: string;
          status_history?: Json;
          subtotal?: number;
          tax_amount?: number;
          delivery_fee?: number;
          total_amount?: number;
          currency?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string | null;
          customer_tin?: string | null;
          delivery_address?: string | null;
          delivery_city?: string | null;
          delivery_sub_city?: string | null;
          special_instructions?: string | null;
          internal_notes?: string | null;
          terms_accepted?: boolean;
          terms_accepted_at?: string | null;
          confirmation_email_sent?: boolean;
          payment_method?: string | null;
          payment_status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey";
            columns: ["customer_id"];
            referencedRelation: "customer_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          product_slug: string | null;
          product_image: string | null;
          category: string | null;
          unit_price: number;
          quantity: number;
          line_total: number;
          selected_options: Json;
          design_file_url: string | null;
          design_file_name: string | null;
          design_file_size: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          product_slug?: string | null;
          product_image?: string | null;
          category?: string | null;
          unit_price: number;
          quantity?: number;
          line_total: number;
          selected_options?: Json;
          design_file_url?: string | null;
          design_file_name?: string | null;
          design_file_size?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          product_name?: string;
          product_slug?: string | null;
          product_image?: string | null;
          category?: string | null;
          unit_price?: number;
          quantity?: number;
          line_total?: number;
          selected_options?: Json;
          design_file_url?: string | null;
          design_file_name?: string | null;
          design_file_size?: number | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
    };
   
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}

// ============================================================
// Convenience type aliases
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
export type ProductImageUpdate =
  Database["public"]["Tables"]["product_images"]["Update"];
export type ProductOptionUpdate =
  Database["public"]["Tables"]["product_options"]["Update"];
export type ProductOptionValueUpdate =
  Database["public"]["Tables"]["product_option_values"]["Update"];
export type CustomerProfileUpdate =
  Database["public"]["Tables"]["customer_profiles"]["Update"];
export type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"];
export type OrderItemUpdate =
  Database["public"]["Tables"]["order_items"]["Update"];

// ============================================================
// Joined / composite types (for queries with relations)
// ============================================================

/** Product with its category info */
export type ProductWithCategory = Product & {
  category: Pick<Category, "name" | "slug"> | null;
};

/** Product with all related data */
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
