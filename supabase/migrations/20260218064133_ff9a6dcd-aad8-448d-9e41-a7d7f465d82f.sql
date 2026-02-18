
-- Create products table
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  image_url text DEFAULT '',
  category text DEFAULT 'general',
  in_stock boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin/receptionist can insert products" ON public.products FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'receptionist'));
CREATE POLICY "Admin/receptionist can update products" ON public.products FOR UPDATE
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'receptionist'));
CREATE POLICY "Admin can delete products" ON public.products FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create product_orders table
CREATE TABLE public.product_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL DEFAULT 0,
  total_amount numeric NOT NULL DEFAULT 0,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  notes text DEFAULT '',
  approved_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.product_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert product_orders" ON public.product_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can read product_orders" ON public.product_orders FOR SELECT USING (true);
CREATE POLICY "Staff can update product_orders" ON public.product_orders FOR UPDATE
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'receptionist'));
CREATE POLICY "Admin can delete product_orders" ON public.product_orders FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_product_orders_updated_at BEFORE UPDATE ON public.product_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

CREATE POLICY "Anyone can view product images" ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');
CREATE POLICY "Auth users can upload product images" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth users can update product images" ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth users can delete product images" ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
