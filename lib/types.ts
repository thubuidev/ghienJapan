export type Category = {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price_jpy: number;
  category_id: string | null;
  is_hot: boolean;
  stock: number;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_contact: string;
  notes: string | null;
  total_jpy: number;
  total_vnd: number;
  status: 'pending' | 'processing' | 'completed';
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  quantity: number;
  price_jpy: number;
  price_vnd: number;
  created_at: string;
};

export type LinkOrder = {
  id: string;
  product_url: string;
  source: 'amazon' | 'rakuten';
  product_name: string;
  product_image: string | null;
  price_jpy: number | null;
  status: 'pending' | 'processing' | 'completed';
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_contact: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CartItem = {
  product_id: string;
  product: Product;
  quantity: number;
};
