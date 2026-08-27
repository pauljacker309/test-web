-- ==============================================================================
-- SUPABASE / POSTGRES SCHEMA FOR SHOP CRUD APPLICATION
-- Project: ShopCRUD
-- Best Practices: Explicit Types, Foreign Key Indexes, Cascades, RLS & Seed Data
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. USERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 2. CATEGORIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 3. PRODUCTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price NUMERIC NOT NULL DEFAULT 0 CHECK (price >= 0),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    image TEXT NOT NULL DEFAULT '',
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 4. CART ITEMS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_cart_user_product UNIQUE (user_id, product_id)
);

-- ------------------------------------------------------------------------------
-- 5. ORDERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    total NUMERIC NOT NULL DEFAULT 0 CHECK (total >= 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 6. ORDER ITEMS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price NUMERIC NOT NULL DEFAULT 0 CHECK (price >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 7. FAVORITES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_favorites_user_product UNIQUE (user_id, product_id)
);

-- ------------------------------------------------------------------------------
-- INDEXES (Postgres Best Practices for Foreign Keys & Filtering)
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON public.cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product_id ON public.favorites(product_id);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) & POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Users policies
DROP POLICY IF EXISTS "Allow all access to users" ON public.users;
CREATE POLICY "Allow all access to users" ON public.users
    FOR ALL TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Categories policies
DROP POLICY IF EXISTS "Allow all access to categories" ON public.categories;
CREATE POLICY "Allow all access to categories" ON public.categories
    FOR ALL TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Products policies
DROP POLICY IF EXISTS "Allow all access to products" ON public.products;
CREATE POLICY "Allow all access to products" ON public.products
    FOR ALL TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Cart items policies
DROP POLICY IF EXISTS "Allow all access to cart_items" ON public.cart_items;
CREATE POLICY "Allow all access to cart_items" ON public.cart_items
    FOR ALL TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Orders policies
DROP POLICY IF EXISTS "Allow all access to orders" ON public.orders;
CREATE POLICY "Allow all access to orders" ON public.orders
    FOR ALL TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Order items policies
DROP POLICY IF EXISTS "Allow all access to order_items" ON public.order_items;
CREATE POLICY "Allow all access to order_items" ON public.order_items
    FOR ALL TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Favorites policies
DROP POLICY IF EXISTS "Allow all access to favorites" ON public.favorites;
CREATE POLICY "Allow all access to favorites" ON public.favorites
    FOR ALL TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Explicitly grant permissions to standard Supabase roles
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- ------------------------------------------------------------------------------
-- SEED DATA (Default users, categories, products)
-- ------------------------------------------------------------------------------
-- Users
INSERT INTO public.users (id, email, name, role, password, created_at)
VALUES 
    ('a1111111-1111-1111-1111-111111111111', 'admin@example.com', 'Admin User', 'admin', 'admin123', now()),
    ('b2222222-2222-2222-2222-222222222222', 'user@example.com', 'Regular User', 'user', 'user123', now())
ON CONFLICT (email) DO UPDATE 
SET name = EXCLUDED.name, role = EXCLUDED.role, password = EXCLUDED.password;

-- Categories
INSERT INTO public.categories (id, name, description, created_at)
VALUES 
    ('c1111111-1111-1111-1111-111111111111', 'Điện thoại', 'Các loại điện thoại thông minh', now()),
    ('c2222222-2222-2222-2222-222222222222', 'Laptop', 'Máy tính xách tay', now()),
    ('c3333333-3333-3333-3333-333333333333', 'Phụ kiện', 'Phụ kiện công nghệ', now())
ON CONFLICT (id) DO NOTHING;

-- Products
INSERT INTO public.products (id, name, description, price, category_id, image, stock, created_at)
VALUES 
    (
        'd1111111-1111-1111-1111-111111111111',
        'iPhone 15 Pro',
        'Điện thoại cao cấp từ Apple',
        29990000,
        'c1111111-1111-1111-1111-111111111111',
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
        50,
        now()
    ),
    (
        'd2222222-2222-2222-2222-222222222222',
        'Samsung Galaxy S24',
        'Flagship Android mới nhất',
        24990000,
        'c1111111-1111-1111-1111-111111111111',
        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
        30,
        now()
    ),
    (
        'd3333333-3333-3333-3333-333333333333',
        'MacBook Pro M3',
        'Laptop chuyên nghiệp cho developer',
        45990000,
        'c2222222-2222-2222-2222-222222222222',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
        20,
        now()
    ),
    (
        'd4444444-4444-4444-4444-444444444444',
        'Dell XPS 15',
        'Laptop cao cấp cho đồ họa',
        35990000,
        'c2222222-2222-2222-2222-222222222222',
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80',
        15,
        now()
    ),
    (
        'd5555555-5555-5555-5555-555555555555',
        'AirPods Pro',
        'Tai nghe không dây chống ồn',
        6990000,
        'c3333333-3333-3333-3333-333333333333',
        'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
        100,
        now()
    )
ON CONFLICT (id) DO NOTHING;
