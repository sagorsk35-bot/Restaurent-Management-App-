-- =====================================================
-- FOODFLOW PLATFORM - Complete Database Schema
-- Multi-tenant Restaurant Management & Delivery Platform
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";      -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS "vector";        -- For AI embeddings (RAG)
CREATE EXTENSION IF NOT EXISTS "postgis";       -- For geospatial queries

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE user_role AS ENUM (
  'superadmin',
  'admin',
  'user',
  'delivery'
);

CREATE TYPE restaurant_status AS ENUM (
  'pending',
  'approved',
  'suspended',
  'banned'
);

CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed',
  'preparing',
  'ready_for_pickup',
  'picked_up',
  'in_transit',
  'delivered',
  'cancelled',
  'refunded'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'completed',
  'failed',
  'refunded'
);

CREATE TYPE delivery_status AS ENUM (
  'available',
  'busy',
  'offline'
);

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Restaurants (multi-tenant core)
CREATE TABLE public.restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  country TEXT DEFAULT 'BD',
  postal_code TEXT,
  location GEOGRAPHY(POINT, 4326),
  phone TEXT NOT NULL,
  email TEXT,
  website TEXT,
  status restaurant_status DEFAULT 'pending',
  is_featured BOOLEAN DEFAULT false,
  commission_rate DECIMAL(5,4) DEFAULT 0.15,
  avg_rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  opening_hours JSONB DEFAULT '{}',
  delivery_radius_km DECIMAL(5,2) DEFAULT 10,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  avg_prep_time_minutes INTEGER DEFAULT 30,
  cuisine_types TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu Categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu Items
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  normalized_name TEXT NOT NULL, -- For price comparison algorithm
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_vegetarian BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  is_gluten_free BOOLEAN DEFAULT false,
  spice_level INTEGER DEFAULT 0 CHECK (spice_level >= 0 AND spice_level <= 5),
  calories INTEGER,
  prep_time_minutes INTEGER DEFAULT 15,
  tags TEXT[] DEFAULT '{}',
  allergens TEXT[] DEFAULT '{}',
  nutrition_info JSONB DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu Item Variants (sizes, add-ons)
CREATE TABLE public.item_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_modifier DECIMAL(10,2) DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Item Add-ons/Modifiers
CREATE TABLE public.item_addons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10,2) DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  max_quantity INTEGER DEFAULT 5,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Delivery Personnel
CREATE TABLE public.delivery_personnel (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  vehicle_type TEXT DEFAULT 'motorcycle',
  vehicle_number TEXT,
  license_number TEXT,
  status delivery_status DEFAULT 'offline',
  current_location GEOGRAPHY(POINT, 4326),
  is_verified BOOLEAN DEFAULT false,
  total_deliveries INTEGER DEFAULT 0,
  avg_rating DECIMAL(3,2) DEFAULT 0,
  earnings_balance DECIMAL(10,2) DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id),
  delivery_person_id UUID REFERENCES public.delivery_personnel(id),
  status order_status DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  service_fee DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  tip DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) DEFAULT 0,
  delivery_address TEXT NOT NULL,
  delivery_location GEOGRAPHY(POINT, 4326),
  delivery_instructions TEXT,
  estimated_delivery_time TIMESTAMPTZ,
  actual_delivery_time TIMESTAMPTZ,
  payment_method TEXT DEFAULT 'cash',
  payment_status payment_status DEFAULT 'pending',
  payment_intent_id TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES public.menu_items(id),
  variant_id UUID REFERENCES public.item_variants(id),
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  addons JSONB DEFAULT '[]',
  special_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Real-time Delivery Tracking Logs
CREATE TABLE public.delivery_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  delivery_person_id UUID NOT NULL REFERENCES public.delivery_personnel(id),
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  heading DECIMAL(5,2),
  speed DECIMAL(5,2),
  accuracy DECIMAL(5,2),
  battery_level INTEGER,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Status History
CREATE TABLE public.order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  notes TEXT,
  changed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id),
  delivery_person_id UUID REFERENCES public.delivery_personnel(id),
  food_rating INTEGER CHECK (food_rating >= 1 AND food_rating <= 5),
  delivery_rating INTEGER CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
  comment TEXT,
  images TEXT[] DEFAULT '{}',
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, order_id)
);

-- Coupons/Promotions
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  max_discount_amount DECIMAL(10,2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Platform Revenue/Transactions
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id),
  restaurant_id UUID REFERENCES public.restaurants(id),
  delivery_person_id UUID REFERENCES public.delivery_personnel(id),
  type TEXT NOT NULL CHECK (type IN ('order_payment', 'commission', 'payout', 'refund', 'tip')),
  amount DECIMAL(10,2) NOT NULL,
  fee DECIMAL(10,2) DEFAULT 0,
  net_amount DECIMAL(10,2) NOT NULL,
  status payment_status DEFAULT 'completed',
  reference TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- AI CHATBOT TABLES (RAG Pipeline)
-- =====================================================

-- Restaurant Knowledge Base (for AI training)
CREATE TABLE public.restaurant_knowledge (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('faq', 'policy', 'menu_info', 'custom')),
  embedding vector(1536), -- OpenAI text-embedding-3-small dimensions
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Conversations
CREATE TABLE public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
  title TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PLATFORM SETTINGS (Superadmin)
-- =====================================================

CREATE TABLE public.platform_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Geospatial indexes
CREATE INDEX idx_restaurants_location ON public.restaurants USING GIST(location);
CREATE INDEX idx_delivery_personnel_location ON public.delivery_personnel USING GIST(current_location);
CREATE INDEX idx_delivery_logs_location ON public.delivery_logs USING GIST(location);
CREATE INDEX idx_orders_delivery_location ON public.orders USING GIST(delivery_location);

-- Text search indexes
CREATE INDEX idx_restaurants_name_trgm ON public.restaurants USING GIN(name gin_trgm_ops);
CREATE INDEX idx_menu_items_name_trgm ON public.menu_items USING GIN(name gin_trgm_ops);
CREATE INDEX idx_menu_items_normalized_name ON public.menu_items USING GIN(normalized_name gin_trgm_ops);

-- Vector similarity search for RAG
CREATE INDEX idx_restaurant_knowledge_embedding ON public.restaurant_knowledge
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Foreign key and common query indexes
CREATE INDEX idx_restaurants_owner ON public.restaurants(owner_id);
CREATE INDEX idx_restaurants_status ON public.restaurants(status);
CREATE INDEX idx_categories_restaurant ON public.categories(restaurant_id);
CREATE INDEX idx_menu_items_restaurant ON public.menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category ON public.menu_items(category_id);
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_restaurant ON public.orders(restaurant_id);
CREATE INDEX idx_orders_delivery_person ON public.orders(delivery_person_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created ON public.orders(created_at DESC);
CREATE INDEX idx_delivery_logs_order ON public.delivery_logs(order_id);
CREATE INDEX idx_delivery_logs_created ON public.delivery_logs(created_at DESC);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX idx_chat_conversations_user ON public.chat_conversations(user_id);
CREATE INDEX idx_chat_messages_conversation ON public.chat_messages(conversation_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'FF-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
    UPPER(SUBSTRING(NEW.id::TEXT, 1, 6));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Normalize dish name for price comparison
CREATE OR REPLACE FUNCTION normalize_dish_name(name TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(name, '[^a-zA-Z0-9\s]', '', 'g'),
      '\s+', ' ', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Auto-normalize menu item names
CREATE OR REPLACE FUNCTION normalize_menu_item_name()
RETURNS TRIGGER AS $$
BEGIN
  NEW.normalized_name = normalize_dish_name(NEW.name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Calculate restaurant statistics
CREATE OR REPLACE FUNCTION update_restaurant_stats(rest_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.restaurants
  SET
    avg_rating = COALESCE((
      SELECT AVG(food_rating)::DECIMAL(3,2)
      FROM public.reviews
      WHERE restaurant_id = rest_id AND food_rating IS NOT NULL
    ), 0),
    total_reviews = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE restaurant_id = rest_id
    ),
    total_orders = (
      SELECT COUNT(*)
      FROM public.orders
      WHERE restaurant_id = rest_id AND status = 'delivered'
    )
  WHERE id = rest_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Find similar dishes for price comparison (using trigram similarity)
CREATE OR REPLACE FUNCTION find_similar_dishes(
  dish_name TEXT,
  current_restaurant_id UUID,
  user_latitude DECIMAL,
  user_longitude DECIMAL,
  radius_km DECIMAL DEFAULT 10,
  similarity_threshold DECIMAL DEFAULT 0.3,
  max_results INTEGER DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  restaurant_id UUID,
  restaurant_name TEXT,
  restaurant_logo TEXT,
  item_name TEXT,
  price DECIMAL,
  image_url TEXT,
  distance_km DECIMAL,
  similarity_score DECIMAL
) AS $$
DECLARE
  normalized_name TEXT;
  user_point GEOGRAPHY;
BEGIN
  normalized_name := normalize_dish_name(dish_name);
  user_point := ST_SetSRID(ST_MakePoint(user_longitude, user_latitude), 4326)::GEOGRAPHY;

  RETURN QUERY
  SELECT
    mi.id,
    mi.restaurant_id,
    r.name AS restaurant_name,
    r.logo_url AS restaurant_logo,
    mi.name AS item_name,
    mi.price,
    mi.image_url,
    (ST_Distance(r.location, user_point) / 1000)::DECIMAL(5,2) AS distance_km,
    similarity(mi.normalized_name, normalized_name)::DECIMAL(4,3) AS similarity_score
  FROM public.menu_items mi
  JOIN public.restaurants r ON mi.restaurant_id = r.id
  WHERE
    mi.restaurant_id != current_restaurant_id
    AND mi.is_available = true
    AND r.status = 'approved'
    AND ST_DWithin(r.location, user_point, radius_km * 1000)
    AND similarity(mi.normalized_name, normalized_name) >= similarity_threshold
  ORDER BY similarity_score DESC, mi.price ASC
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Vector similarity search for RAG chatbot
CREATE OR REPLACE FUNCTION match_restaurant_knowledge(
  query_embedding vector(1536),
  rest_id UUID,
  match_threshold DECIMAL DEFAULT 0.7,
  match_count INTEGER DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  type TEXT,
  similarity DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    rk.id,
    rk.title,
    rk.content,
    rk.type,
    (1 - (rk.embedding <=> query_embedding))::DECIMAL(4,3) AS similarity
  FROM public.restaurant_knowledge rk
  WHERE
    rk.restaurant_id = rest_id
    AND rk.is_active = true
    AND (1 - (rk.embedding <=> query_embedding)) >= match_threshold
  ORDER BY rk.embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Updated_at triggers
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_restaurants
  BEFORE UPDATE ON public.restaurants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_menu_items
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_orders
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Order number generation
CREATE TRIGGER generate_order_number_trigger
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Menu item name normalization
CREATE TRIGGER normalize_menu_item_trigger
  BEFORE INSERT OR UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION normalize_menu_item_name();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_personnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check user role
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function to check if user owns restaurant
CREATE OR REPLACE FUNCTION auth.owns_restaurant(rest_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.restaurants
    WHERE id = rest_id AND owner_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- =====================================================
-- PROFILES RLS
-- =====================================================

-- Users can read their own profile
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT USING (id = auth.uid());

-- Superadmins can read all profiles
CREATE POLICY profiles_select_superadmin ON public.profiles
  FOR SELECT USING (auth.user_role() = 'superadmin');

-- Users can update their own profile
CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE USING (id = auth.uid());

-- Superadmins can update any profile
CREATE POLICY profiles_update_superadmin ON public.profiles
  FOR UPDATE USING (auth.user_role() = 'superadmin');

-- =====================================================
-- RESTAURANTS RLS
-- =====================================================

-- Anyone can view approved restaurants
CREATE POLICY restaurants_select_public ON public.restaurants
  FOR SELECT USING (status = 'approved');

-- Restaurant owners can see their own restaurants regardless of status
CREATE POLICY restaurants_select_owner ON public.restaurants
  FOR SELECT USING (owner_id = auth.uid());

-- Superadmins can see all restaurants
CREATE POLICY restaurants_select_superadmin ON public.restaurants
  FOR SELECT USING (auth.user_role() = 'superadmin');

-- Restaurant owners can insert their own restaurants
CREATE POLICY restaurants_insert_owner ON public.restaurants
  FOR INSERT WITH CHECK (owner_id = auth.uid() AND auth.user_role() = 'admin');

-- Restaurant owners can update their own restaurants
CREATE POLICY restaurants_update_owner ON public.restaurants
  FOR UPDATE USING (owner_id = auth.uid());

-- Superadmins can update any restaurant (for approval/ban)
CREATE POLICY restaurants_update_superadmin ON public.restaurants
  FOR UPDATE USING (auth.user_role() = 'superadmin');

-- =====================================================
-- CATEGORIES RLS
-- =====================================================

-- Anyone can view categories of approved restaurants
CREATE POLICY categories_select_public ON public.categories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.restaurants
      WHERE id = restaurant_id AND status = 'approved'
    )
  );

-- Restaurant owners can manage their own categories
CREATE POLICY categories_manage_owner ON public.categories
  FOR ALL USING (auth.owns_restaurant(restaurant_id));

-- Superadmins can manage all categories
CREATE POLICY categories_manage_superadmin ON public.categories
  FOR ALL USING (auth.user_role() = 'superadmin');

-- =====================================================
-- MENU ITEMS RLS
-- =====================================================

-- Anyone can view menu items of approved restaurants
CREATE POLICY menu_items_select_public ON public.menu_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.restaurants
      WHERE id = restaurant_id AND status = 'approved'
    )
  );

-- Restaurant owners can manage their own menu items
CREATE POLICY menu_items_manage_owner ON public.menu_items
  FOR ALL USING (auth.owns_restaurant(restaurant_id));

-- Superadmins can manage all menu items
CREATE POLICY menu_items_manage_superadmin ON public.menu_items
  FOR ALL USING (auth.user_role() = 'superadmin');

-- =====================================================
-- ITEM VARIANTS & ADDONS RLS
-- =====================================================

CREATE POLICY item_variants_select_public ON public.item_variants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.menu_items mi
      JOIN public.restaurants r ON mi.restaurant_id = r.id
      WHERE mi.id = menu_item_id AND r.status = 'approved'
    )
  );

CREATE POLICY item_variants_manage_owner ON public.item_variants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.menu_items
      WHERE id = menu_item_id AND auth.owns_restaurant(restaurant_id)
    )
  );

CREATE POLICY item_addons_select_public ON public.item_addons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.menu_items mi
      JOIN public.restaurants r ON mi.restaurant_id = r.id
      WHERE mi.id = menu_item_id AND r.status = 'approved'
    )
  );

CREATE POLICY item_addons_manage_owner ON public.item_addons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.menu_items
      WHERE id = menu_item_id AND auth.owns_restaurant(restaurant_id)
    )
  );

-- =====================================================
-- DELIVERY PERSONNEL RLS
-- =====================================================

-- Delivery personnel can see and update their own record
CREATE POLICY delivery_personnel_own ON public.delivery_personnel
  FOR ALL USING (user_id = auth.uid());

-- Superadmins can see all delivery personnel
CREATE POLICY delivery_personnel_superadmin ON public.delivery_personnel
  FOR ALL USING (auth.user_role() = 'superadmin');

-- Restaurant admins can see available delivery personnel
CREATE POLICY delivery_personnel_admins ON public.delivery_personnel
  FOR SELECT USING (
    auth.user_role() = 'admin' AND status = 'available'
  );

-- =====================================================
-- ORDERS RLS
-- =====================================================

-- Users can see their own orders
CREATE POLICY orders_select_user ON public.orders
  FOR SELECT USING (user_id = auth.uid());

-- Restaurant owners can see orders for their restaurants
CREATE POLICY orders_select_restaurant ON public.orders
  FOR SELECT USING (auth.owns_restaurant(restaurant_id));

-- Delivery personnel can see assigned orders
CREATE POLICY orders_select_delivery ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.delivery_personnel
      WHERE id = delivery_person_id AND user_id = auth.uid()
    )
  );

-- Superadmins can see all orders
CREATE POLICY orders_select_superadmin ON public.orders
  FOR SELECT USING (auth.user_role() = 'superadmin');

-- Users can create orders
CREATE POLICY orders_insert_user ON public.orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Restaurant owners can update order status
CREATE POLICY orders_update_restaurant ON public.orders
  FOR UPDATE USING (auth.owns_restaurant(restaurant_id));

-- Delivery personnel can update assigned orders
CREATE POLICY orders_update_delivery ON public.orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.delivery_personnel
      WHERE id = delivery_person_id AND user_id = auth.uid()
    )
  );

-- Superadmins can update any order
CREATE POLICY orders_update_superadmin ON public.orders
  FOR UPDATE USING (auth.user_role() = 'superadmin');

-- =====================================================
-- ORDER ITEMS RLS
-- =====================================================

CREATE POLICY order_items_select ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_id AND (
        user_id = auth.uid() OR
        auth.owns_restaurant(restaurant_id) OR
        auth.user_role() = 'superadmin'
      )
    )
  );

CREATE POLICY order_items_insert ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_id AND user_id = auth.uid()
    )
  );

-- =====================================================
-- DELIVERY LOGS RLS (Real-time Tracking)
-- =====================================================

-- Users can see delivery logs for their orders
CREATE POLICY delivery_logs_select_user ON public.delivery_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_id AND user_id = auth.uid()
    )
  );

-- Restaurant owners can see delivery logs for their orders
CREATE POLICY delivery_logs_select_restaurant ON public.delivery_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND auth.owns_restaurant(o.restaurant_id)
    )
  );

-- Delivery personnel can insert logs for their deliveries
CREATE POLICY delivery_logs_insert_delivery ON public.delivery_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.delivery_personnel
      WHERE id = delivery_person_id AND user_id = auth.uid()
    )
  );

-- Superadmins can see all delivery logs
CREATE POLICY delivery_logs_select_superadmin ON public.delivery_logs
  FOR SELECT USING (auth.user_role() = 'superadmin');

-- =====================================================
-- REVIEWS RLS
-- =====================================================

-- Anyone can read reviews
CREATE POLICY reviews_select_public ON public.reviews
  FOR SELECT USING (true);

-- Users can create reviews for their orders
CREATE POLICY reviews_insert_user ON public.reviews
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own reviews
CREATE POLICY reviews_update_user ON public.reviews
  FOR UPDATE USING (user_id = auth.uid());

-- =====================================================
-- COUPONS RLS
-- =====================================================

-- Active global coupons are visible to all
CREATE POLICY coupons_select_global ON public.coupons
  FOR SELECT USING (
    restaurant_id IS NULL AND is_active = true
  );

-- Restaurant coupons are visible to users
CREATE POLICY coupons_select_restaurant ON public.coupons
  FOR SELECT USING (
    is_active = true AND EXISTS (
      SELECT 1 FROM public.restaurants
      WHERE id = restaurant_id AND status = 'approved'
    )
  );

-- Restaurant owners can manage their coupons
CREATE POLICY coupons_manage_owner ON public.coupons
  FOR ALL USING (auth.owns_restaurant(restaurant_id));

-- Superadmins can manage all coupons
CREATE POLICY coupons_manage_superadmin ON public.coupons
  FOR ALL USING (auth.user_role() = 'superadmin');

-- =====================================================
-- TRANSACTIONS RLS
-- =====================================================

-- Restaurant owners can see their transactions
CREATE POLICY transactions_select_restaurant ON public.transactions
  FOR SELECT USING (auth.owns_restaurant(restaurant_id));

-- Delivery personnel can see their transactions
CREATE POLICY transactions_select_delivery ON public.transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.delivery_personnel
      WHERE id = delivery_person_id AND user_id = auth.uid()
    )
  );

-- Superadmins can see all transactions
CREATE POLICY transactions_select_superadmin ON public.transactions
  FOR SELECT USING (auth.user_role() = 'superadmin');

-- =====================================================
-- NOTIFICATIONS RLS
-- =====================================================

CREATE POLICY notifications_own ON public.notifications
  FOR ALL USING (user_id = auth.uid());

-- =====================================================
-- RESTAURANT KNOWLEDGE RLS (AI Chatbot)
-- =====================================================

-- Anyone can read knowledge for approved restaurants (for chatbot)
CREATE POLICY knowledge_select_public ON public.restaurant_knowledge
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.restaurants
      WHERE id = restaurant_id AND status = 'approved'
    )
  );

-- Restaurant owners can manage their knowledge base
CREATE POLICY knowledge_manage_owner ON public.restaurant_knowledge
  FOR ALL USING (auth.owns_restaurant(restaurant_id));

-- Superadmins can manage all knowledge
CREATE POLICY knowledge_manage_superadmin ON public.restaurant_knowledge
  FOR ALL USING (auth.user_role() = 'superadmin');

-- =====================================================
-- CHAT CONVERSATIONS & MESSAGES RLS
-- =====================================================

CREATE POLICY chat_conversations_own ON public.chat_conversations
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY chat_messages_own ON public.chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_conversations
      WHERE id = conversation_id AND user_id = auth.uid()
    )
  );

CREATE POLICY chat_messages_insert ON public.chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_conversations
      WHERE id = conversation_id AND user_id = auth.uid()
    )
  );

-- =====================================================
-- PLATFORM SETTINGS RLS
-- =====================================================

-- Only superadmins can manage platform settings
CREATE POLICY platform_settings_superadmin ON public.platform_settings
  FOR ALL USING (auth.user_role() = 'superadmin');

-- Anyone can read non-sensitive settings
CREATE POLICY platform_settings_read ON public.platform_settings
  FOR SELECT USING (
    NOT (value ? 'sensitive' AND (value->>'sensitive')::boolean = true)
  );

-- =====================================================
-- REALTIME SUBSCRIPTIONS
-- =====================================================

-- Enable realtime for specific tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.delivery_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_status_history;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Insert default platform settings
INSERT INTO public.platform_settings (key, value, description) VALUES
  ('commission_rate', '{"value": 0.15}', 'Default platform commission rate'),
  ('delivery_fee_base', '{"value": 30}', 'Base delivery fee in BDT'),
  ('delivery_fee_per_km', '{"value": 10}', 'Additional delivery fee per km'),
  ('min_order_amount', '{"value": 100}', 'Minimum order amount'),
  ('service_fee_rate', '{"value": 0.02}', 'Service fee rate'),
  ('max_delivery_radius', '{"value": 15}', 'Maximum delivery radius in km');
