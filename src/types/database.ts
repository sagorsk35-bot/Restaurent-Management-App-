// =====================================================
// FOODFLOW PLATFORM - Database Types
// Auto-generated from Supabase schema
// =====================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'superadmin' | 'admin' | 'user' | 'delivery'
export type RestaurantStatus = 'pending' | 'approved' | 'suspended' | 'banned'
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'
export type DeliveryStatus = 'available' | 'busy' | 'offline'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          role: UserRole
          is_active: boolean
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: UserRole
          is_active?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: UserRole
          is_active?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      restaurants: {
        Row: {
          id: string
          owner_id: string
          name: string
          slug: string
          description: string | null
          logo_url: string | null
          cover_image_url: string | null
          address: string
          city: string
          state: string | null
          country: string
          postal_code: string | null
          location: unknown | null
          phone: string
          email: string | null
          website: string | null
          status: RestaurantStatus
          is_featured: boolean
          commission_rate: number
          avg_rating: number
          total_reviews: number
          total_orders: number
          opening_hours: Json
          delivery_radius_km: number
          min_order_amount: number
          avg_prep_time_minutes: number
          cuisine_types: string[]
          tags: string[]
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          slug: string
          description?: string | null
          logo_url?: string | null
          cover_image_url?: string | null
          address: string
          city: string
          state?: string | null
          country?: string
          postal_code?: string | null
          location?: unknown | null
          phone: string
          email?: string | null
          website?: string | null
          status?: RestaurantStatus
          is_featured?: boolean
          commission_rate?: number
          avg_rating?: number
          total_reviews?: number
          total_orders?: number
          opening_hours?: Json
          delivery_radius_km?: number
          min_order_amount?: number
          avg_prep_time_minutes?: number
          cuisine_types?: string[]
          tags?: string[]
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          slug?: string
          description?: string | null
          logo_url?: string | null
          cover_image_url?: string | null
          address?: string
          city?: string
          state?: string | null
          country?: string
          postal_code?: string | null
          location?: unknown | null
          phone?: string
          email?: string | null
          website?: string | null
          status?: RestaurantStatus
          is_featured?: boolean
          commission_rate?: number
          avg_rating?: number
          total_reviews?: number
          total_orders?: number
          opening_hours?: Json
          delivery_radius_km?: number
          min_order_amount?: number
          avg_prep_time_minutes?: number
          cuisine_types?: string[]
          tags?: string[]
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          description: string | null
          image_url: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          description?: string | null
          image_url?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      menu_items: {
        Row: {
          id: string
          restaurant_id: string
          category_id: string | null
          name: string
          normalized_name: string
          description: string | null
          price: number
          compare_at_price: number | null
          image_url: string | null
          is_available: boolean
          is_featured: boolean
          is_vegetarian: boolean
          is_vegan: boolean
          is_gluten_free: boolean
          spice_level: number
          calories: number | null
          prep_time_minutes: number
          tags: string[]
          allergens: string[]
          nutrition_info: Json
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          category_id?: string | null
          name: string
          normalized_name?: string
          description?: string | null
          price: number
          compare_at_price?: number | null
          image_url?: string | null
          is_available?: boolean
          is_featured?: boolean
          is_vegetarian?: boolean
          is_vegan?: boolean
          is_gluten_free?: boolean
          spice_level?: number
          calories?: number | null
          prep_time_minutes?: number
          tags?: string[]
          allergens?: string[]
          nutrition_info?: Json
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          category_id?: string | null
          name?: string
          normalized_name?: string
          description?: string | null
          price?: number
          compare_at_price?: number | null
          image_url?: string | null
          is_available?: boolean
          is_featured?: boolean
          is_vegetarian?: boolean
          is_vegan?: boolean
          is_gluten_free?: boolean
          spice_level?: number
          calories?: number | null
          prep_time_minutes?: number
          tags?: string[]
          allergens?: string[]
          nutrition_info?: Json
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      item_variants: {
        Row: {
          id: string
          menu_item_id: string
          name: string
          price_modifier: number
          is_default: boolean
          is_available: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          menu_item_id: string
          name: string
          price_modifier?: number
          is_default?: boolean
          is_available?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          menu_item_id?: string
          name?: string
          price_modifier?: number
          is_default?: boolean
          is_available?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      item_addons: {
        Row: {
          id: string
          menu_item_id: string
          name: string
          price: number
          is_available: boolean
          max_quantity: number
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          menu_item_id: string
          name: string
          price?: number
          is_available?: boolean
          max_quantity?: number
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          menu_item_id?: string
          name?: string
          price?: number
          is_available?: boolean
          max_quantity?: number
          sort_order?: number
          created_at?: string
        }
      }
      delivery_personnel: {
        Row: {
          id: string
          user_id: string
          vehicle_type: string
          vehicle_number: string | null
          license_number: string | null
          status: DeliveryStatus
          current_location: unknown | null
          is_verified: boolean
          total_deliveries: number
          avg_rating: number
          earnings_balance: number
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vehicle_type?: string
          vehicle_number?: string | null
          license_number?: string | null
          status?: DeliveryStatus
          current_location?: unknown | null
          is_verified?: boolean
          total_deliveries?: number
          avg_rating?: number
          earnings_balance?: number
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vehicle_type?: string
          vehicle_number?: string | null
          license_number?: string | null
          status?: DeliveryStatus
          current_location?: unknown | null
          is_verified?: boolean
          total_deliveries?: number
          avg_rating?: number
          earnings_balance?: number
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string
          restaurant_id: string
          delivery_person_id: string | null
          status: OrderStatus
          subtotal: number
          delivery_fee: number
          service_fee: number
          tax: number
          discount: number
          tip: number
          total: number
          commission_amount: number
          delivery_address: string
          delivery_location: unknown | null
          delivery_instructions: string | null
          estimated_delivery_time: string | null
          actual_delivery_time: string | null
          payment_method: string
          payment_status: PaymentStatus
          payment_intent_id: string | null
          notes: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number?: string
          user_id: string
          restaurant_id: string
          delivery_person_id?: string | null
          status?: OrderStatus
          subtotal: number
          delivery_fee?: number
          service_fee?: number
          tax?: number
          discount?: number
          tip?: number
          total: number
          commission_amount?: number
          delivery_address: string
          delivery_location?: unknown | null
          delivery_instructions?: string | null
          estimated_delivery_time?: string | null
          actual_delivery_time?: string | null
          payment_method?: string
          payment_status?: PaymentStatus
          payment_intent_id?: string | null
          notes?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string
          restaurant_id?: string
          delivery_person_id?: string | null
          status?: OrderStatus
          subtotal?: number
          delivery_fee?: number
          service_fee?: number
          tax?: number
          discount?: number
          tip?: number
          total?: number
          commission_amount?: number
          delivery_address?: string
          delivery_location?: unknown | null
          delivery_instructions?: string | null
          estimated_delivery_time?: string | null
          actual_delivery_time?: string | null
          payment_method?: string
          payment_status?: PaymentStatus
          payment_intent_id?: string | null
          notes?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          menu_item_id: string | null
          variant_id: string | null
          name: string
          quantity: number
          unit_price: number
          total_price: number
          addons: Json
          special_instructions: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          menu_item_id?: string | null
          variant_id?: string | null
          name: string
          quantity?: number
          unit_price: number
          total_price: number
          addons?: Json
          special_instructions?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          menu_item_id?: string | null
          variant_id?: string | null
          name?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          addons?: Json
          special_instructions?: string | null
          created_at?: string
        }
      }
      delivery_logs: {
        Row: {
          id: string
          order_id: string
          delivery_person_id: string
          location: unknown
          latitude: number
          longitude: number
          heading: number | null
          speed: number | null
          accuracy: number | null
          battery_level: number | null
          status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          delivery_person_id: string
          location: unknown
          latitude: number
          longitude: number
          heading?: number | null
          speed?: number | null
          accuracy?: number | null
          battery_level?: number | null
          status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          delivery_person_id?: string
          location?: unknown
          latitude?: number
          longitude?: number
          heading?: number | null
          speed?: number | null
          accuracy?: number | null
          battery_level?: number | null
          status?: string | null
          created_at?: string
        }
      }
      order_status_history: {
        Row: {
          id: string
          order_id: string
          status: OrderStatus
          notes: string | null
          changed_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          status: OrderStatus
          notes?: string | null
          changed_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          status?: OrderStatus
          notes?: string | null
          changed_by?: string | null
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          restaurant_id: string
          order_id: string | null
          delivery_person_id: string | null
          food_rating: number | null
          delivery_rating: number | null
          comment: string | null
          images: string[]
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          restaurant_id: string
          order_id?: string | null
          delivery_person_id?: string | null
          food_rating?: number | null
          delivery_rating?: number | null
          comment?: string | null
          images?: string[]
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          restaurant_id?: string
          order_id?: string | null
          delivery_person_id?: string | null
          food_rating?: number | null
          delivery_rating?: number | null
          comment?: string | null
          images?: string[]
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      coupons: {
        Row: {
          id: string
          restaurant_id: string | null
          code: string
          description: string | null
          discount_type: string
          discount_value: number
          min_order_amount: number
          max_discount_amount: number | null
          usage_limit: number | null
          used_count: number
          is_active: boolean
          starts_at: string
          expires_at: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id?: string | null
          code: string
          description?: string | null
          discount_type: string
          discount_value: number
          min_order_amount?: number
          max_discount_amount?: number | null
          usage_limit?: number | null
          used_count?: number
          is_active?: boolean
          starts_at?: string
          expires_at?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string | null
          code?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          min_order_amount?: number
          max_discount_amount?: number | null
          usage_limit?: number | null
          used_count?: number
          is_active?: boolean
          starts_at?: string
          expires_at?: string | null
          metadata?: Json
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          order_id: string | null
          restaurant_id: string | null
          delivery_person_id: string | null
          type: string
          amount: number
          fee: number
          net_amount: number
          status: PaymentStatus
          reference: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          restaurant_id?: string | null
          delivery_person_id?: string | null
          type: string
          amount: number
          fee?: number
          net_amount: number
          status?: PaymentStatus
          reference?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string | null
          restaurant_id?: string | null
          delivery_person_id?: string | null
          type?: string
          amount?: number
          fee?: number
          net_amount?: number
          status?: PaymentStatus
          reference?: string | null
          metadata?: Json
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          body: string
          type: string
          data: Json
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          body: string
          type: string
          data?: Json
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          body?: string
          type?: string
          data?: Json
          is_read?: boolean
          created_at?: string
        }
      }
      restaurant_knowledge: {
        Row: {
          id: string
          restaurant_id: string
          title: string
          content: string
          type: string
          embedding: number[] | null
          metadata: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          title: string
          content: string
          type: string
          embedding?: number[] | null
          metadata?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          title?: string
          content?: string
          type?: string
          embedding?: number[] | null
          metadata?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      chat_conversations: {
        Row: {
          id: string
          user_id: string
          restaurant_id: string | null
          title: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          restaurant_id?: string | null
          title?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          restaurant_id?: string | null
          title?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          conversation_id: string
          role: string
          content: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: string
          content: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: string
          content?: string
          metadata?: Json
          created_at?: string
        }
      }
      platform_settings: {
        Row: {
          id: string
          key: string
          value: Json
          description: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          description?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          description?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      find_similar_dishes: {
        Args: {
          dish_name: string
          current_restaurant_id: string
          user_latitude: number
          user_longitude: number
          radius_km?: number
          similarity_threshold?: number
          max_results?: number
        }
        Returns: {
          id: string
          restaurant_id: string
          restaurant_name: string
          restaurant_logo: string | null
          item_name: string
          price: number
          image_url: string | null
          distance_km: number
          similarity_score: number
        }[]
      }
      match_restaurant_knowledge: {
        Args: {
          query_embedding: number[]
          rest_id: string
          match_threshold?: number
          match_count?: number
        }
        Returns: {
          id: string
          title: string
          content: string
          type: string
          similarity: number
        }[]
      }
    }
    Enums: {
      user_role: UserRole
      restaurant_status: RestaurantStatus
      order_status: OrderStatus
      payment_status: PaymentStatus
      delivery_status: DeliveryStatus
    }
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Restaurant = Database['public']['Tables']['restaurants']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type MenuItem = Database['public']['Tables']['menu_items']['Row']
export type ItemVariant = Database['public']['Tables']['item_variants']['Row']
export type ItemAddon = Database['public']['Tables']['item_addons']['Row']
export type DeliveryPersonnel = Database['public']['Tables']['delivery_personnel']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type DeliveryLog = Database['public']['Tables']['delivery_logs']['Row']
export type OrderStatusHistory = Database['public']['Tables']['order_status_history']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Coupon = Database['public']['Tables']['coupons']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type RestaurantKnowledge = Database['public']['Tables']['restaurant_knowledge']['Row']
export type ChatConversation = Database['public']['Tables']['chat_conversations']['Row']
export type ChatMessage = Database['public']['Tables']['chat_messages']['Row']
export type PlatformSetting = Database['public']['Tables']['platform_settings']['Row']

// Extended types with relations
export interface MenuItemWithDetails extends MenuItem {
  category?: Category
  variants?: ItemVariant[]
  addons?: ItemAddon[]
}

export interface OrderWithDetails extends Order {
  restaurant?: Restaurant
  items?: OrderItem[]
  delivery_person?: DeliveryPersonnel & { profile?: Profile }
  user?: Profile
  status_history?: OrderStatusHistory[]
}

export interface RestaurantWithDetails extends Restaurant {
  owner?: Profile
  categories?: Category[]
  menu_items?: MenuItem[]
  reviews?: Review[]
}

export interface SimilarDish {
  id: string
  restaurant_id: string
  restaurant_name: string
  restaurant_logo: string | null
  item_name: string
  price: number
  image_url: string | null
  distance_km: number
  similarity_score: number
}
