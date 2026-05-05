-- PrintOnline.et v3.6 — Migration 023: Admin RLS Policies
-- Adds write policies for CMS admin operations on core tables

-- Admin policies for categories (write access)
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access categories' AND tablename = 'categories'
    ) THEN
        CREATE POLICY "Admin full access categories" ON categories FOR ALL
            USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Admin policies for products (write access)
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access products' AND tablename = 'products'
    ) THEN
        CREATE POLICY "Admin full access products" ON products FOR ALL
            USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Admin policies for product_options
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access product_options' AND tablename = 'product_options'
    ) THEN
        CREATE POLICY "Admin full access product_options" ON product_options FOR ALL
            USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Admin policies for product_option_values
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access product_option_values' AND tablename = 'product_option_values'
    ) THEN
        CREATE POLICY "Admin full access product_option_values" ON product_option_values FOR ALL
            USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Admin policies for product_images
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access product_images' AND tablename = 'product_images'
    ) THEN
        CREATE POLICY "Admin full access product_images" ON product_images FOR ALL
            USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Admin policies for pricing_matrix
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access pricing_matrix' AND tablename = 'product_pricing_matrix'
    ) THEN
        CREATE POLICY "Admin full access pricing_matrix" ON product_pricing_matrix FOR ALL
            USING (true) WITH CHECK (true);
    END IF;
END $$;
