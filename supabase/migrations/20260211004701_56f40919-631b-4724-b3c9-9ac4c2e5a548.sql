
-- 1. Revenue Allocation Rules table
CREATE TABLE public.revenue_allocation_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  percentage numeric NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.revenue_allocation_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read revenue_allocation_rules"
  ON public.revenue_allocation_rules FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert revenue_allocation_rules"
  ON public.revenue_allocation_rules FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update revenue_allocation_rules"
  ON public.revenue_allocation_rules FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete revenue_allocation_rules"
  ON public.revenue_allocation_rules FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed default rules
INSERT INTO public.revenue_allocation_rules (category, percentage) VALUES
  ('Direct Costs', 25),
  ('Base Operations', 20),
  ('Volume Bonus Pool', 5),
  ('Clinical Savings', 30),
  ('Investors', 15),
  ('Tithe', 5);

-- Updated_at trigger
CREATE TRIGGER update_revenue_allocation_rules_updated_at
  BEFORE UPDATE ON public.revenue_allocation_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Revenue Allocations table (immutable records)
CREATE TABLE public.revenue_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  category text NOT NULL,
  percentage numeric NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.revenue_allocations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read revenue_allocations"
  ON public.revenue_allocations FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert revenue_allocations"
  ON public.revenue_allocations FOR INSERT
  WITH CHECK (true);

-- 3. War Chest Entries table
CREATE TABLE public.war_chest_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  excess_amount numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.war_chest_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read war_chest_entries"
  ON public.war_chest_entries FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert war_chest_entries"
  ON public.war_chest_entries FOR INSERT
  WITH CHECK (true);

-- 4. Trigger function for automatic allocation on payment insert
CREATE OR REPLACE FUNCTION public.allocate_revenue_on_payment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  rule RECORD;
  inv RECORD;
  total_paid numeric;
  excess numeric;
BEGIN
  BEGIN
    -- Check if allocation is active (any rule with is_active = true)
    IF NOT EXISTS (SELECT 1 FROM public.revenue_allocation_rules WHERE is_active = true LIMIT 1) THEN
      RETURN NEW;
    END IF;

    -- Insert allocation rows for each active rule
    FOR rule IN SELECT category, percentage FROM public.revenue_allocation_rules WHERE is_active = true
    LOOP
      INSERT INTO public.revenue_allocations (payment_id, category, percentage, amount)
      VALUES (NEW.id, rule.category, rule.percentage, ROUND(NEW.amount * rule.percentage / 100, 2));
    END LOOP;

    -- Check for excess payment (war chest)
    SELECT total_amount, amount_paid INTO inv FROM public.invoices WHERE id = NEW.invoice_id;
    IF inv IS NOT NULL THEN
      total_paid := inv.amount_paid + NEW.amount;
      IF total_paid > inv.total_amount THEN
        excess := total_paid - inv.total_amount;
        -- Cap excess at the payment amount (in case amount_paid was already over)
        IF excess > NEW.amount THEN
          excess := NEW.amount;
        END IF;
        INSERT INTO public.war_chest_entries (payment_id, excess_amount)
        VALUES (NEW.id, excess);
      END IF;
    END IF;

  EXCEPTION WHEN OTHERS THEN
    -- Never block payment recording
    RAISE WARNING 'Revenue allocation failed for payment %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_allocate_revenue
  AFTER INSERT ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.allocate_revenue_on_payment();
