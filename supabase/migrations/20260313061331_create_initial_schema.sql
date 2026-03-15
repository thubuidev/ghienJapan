/*
  # Initial Schema for Japanese Product Ordering Service

  1. New Tables
    - `categories` - Product categories
    - `products` - Japanese products with pricing
    - `orders` - Customer orders
    - `order_items` - Individual items in orders
    - `link_orders` - Link-based product requests from users
    - `admin_users` - Admin accounts (using Supabase Auth)

  2. Security
    - Enable RLS on all tables
    - Public read access on products and categories
    - Authenticated admin access for orders and admin features
    - Insert access for link_orders from public users

  3. Important Notes
    - JPY to VND conversion rate: 1 JPY = 170 VND
    - All prices stored in JPY in database
    - VND calculated on display/retrieval
    - Orders track both JPY and VND for record keeping
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  price_jpy integer NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  is_hot boolean DEFAULT false,
  stock integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text NOT NULL,
  customer_contact text NOT NULL,
  notes text,
  total_jpy integer NOT NULL,
  total_vnd integer NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  quantity integer NOT NULL,
  price_jpy integer NOT NULL,
  price_vnd integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create link_orders table
CREATE TABLE IF NOT EXISTS link_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_url text NOT NULL,
  source text NOT NULL,
  product_name text NOT NULL,
  product_image text,
  price_jpy integer,
  status text DEFAULT 'pending',
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text NOT NULL,
  customer_contact text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_orders ENABLE ROW LEVEL SECURITY;

-- Categories: Public read access
CREATE POLICY "Public read categories"
  ON categories FOR SELECT
  USING (true);

-- Products: Public read access
CREATE POLICY "Public read products"
  ON products FOR SELECT
  USING (true);

-- Orders: Admin only access
CREATE POLICY "Authenticated users can read own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = id AND auth.uid() IN (
        SELECT id FROM auth.users WHERE raw_app_meta_data->>'role' = 'admin'
      )
    )
  );

CREATE POLICY "Authenticated users can insert orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE raw_app_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Order items: Authenticated access
CREATE POLICY "Authenticated users can insert order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Link orders: Public insert, admin read/update
CREATE POLICY "Public can insert link orders"
  ON link_orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read link orders"
  ON link_orders FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE raw_app_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can update link orders"
  ON link_orders FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE raw_app_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_is_hot ON products(is_hot);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_link_orders_status ON link_orders(status);
CREATE INDEX idx_orders_status ON orders(status);