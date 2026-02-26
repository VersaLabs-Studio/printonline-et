-- PrintOnline.et v2.0 — Migration 008: Utility Functions & Triggers
-- Auto-update timestamps and helper functions

-- ============================================================
-- Auto-update updated_at on row modification
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_categories_timestamp
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_products_timestamp
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_customer_profiles_timestamp
  BEFORE UPDATE ON customer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_timestamp
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Helper: Generate slug from product/category name
-- ============================================================

CREATE OR REPLACE FUNCTION generate_slug(input TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        TRIM(input),
        '[^a-zA-Z0-9\s-]', '', 'g'   -- Remove special chars
      ),
      '\s+', '-', 'g'                 -- Replace spaces with hyphens
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================
-- Helper: Calculate order totals
-- ============================================================

CREATE OR REPLACE FUNCTION recalculate_order_totals()
RETURNS TRIGGER AS $$
DECLARE
  calc_subtotal DECIMAL(12,2);
BEGIN
  SELECT COALESCE(SUM(line_total), 0) INTO calc_subtotal
  FROM order_items
  WHERE order_id = COALESCE(NEW.order_id, OLD.order_id);

  UPDATE orders
  SET subtotal = calc_subtotal,
      total_amount = calc_subtotal + COALESCE(tax_amount, 0) + COALESCE(delivery_fee, 0)
  WHERE id = COALESCE(NEW.order_id, OLD.order_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER recalculate_order_on_item_change
  AFTER INSERT OR UPDATE OR DELETE ON order_items
  FOR EACH ROW EXECUTE FUNCTION recalculate_order_totals();
