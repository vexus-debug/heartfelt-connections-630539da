
-- 1. Add date_from, date_to columns to ld_invoices for custom date range invoicing
ALTER TABLE public.ld_invoices
  ADD COLUMN IF NOT EXISTS date_from date,
  ADD COLUMN IF NOT EXISTS date_to date,
  ADD COLUMN IF NOT EXISTS deposit_amount numeric DEFAULT 0;

-- 2. Create ld_invoice_items for granular invoice line items
CREATE TABLE public.ld_invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES public.ld_invoices(id) ON DELETE CASCADE NOT NULL,
  lab_case_id uuid REFERENCES public.ld_cases(id) ON DELETE SET NULL,
  date_in date,
  code text DEFAULT '',
  patient_name text DEFAULT '',
  job_description text DEFAULT '',
  units integer DEFAULT 1,
  unit_price numeric DEFAULT 0,
  total_cost numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.ld_invoice_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to ld_invoice_items" ON public.ld_invoice_items FOR ALL USING (true) WITH CHECK (true);

-- 3. Create ld_staff_revenue_allocations for staff pay distribution
CREATE TABLE public.ld_staff_revenue_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period_start date NOT NULL,
  period_end date NOT NULL,
  staff_id uuid REFERENCES public.ld_staff(id) ON DELETE CASCADE NOT NULL,
  allocation_type text NOT NULL DEFAULT 'output',
  jobs_count integer DEFAULT 0,
  total_revenue numeric DEFAULT 0,
  allocated_amount numeric DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.ld_staff_revenue_allocations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to ld_staff_revenue_allocations" ON public.ld_staff_revenue_allocations FOR ALL USING (true) WITH CHECK (true);

-- 4. Create ld_expenses for lab expense tracking
CREATE TABLE public.ld_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_date date NOT NULL DEFAULT CURRENT_DATE,
  category text NOT NULL DEFAULT 'general',
  vendor text DEFAULT '',
  description text DEFAULT '',
  amount numeric NOT NULL DEFAULT 0,
  payment_method text DEFAULT 'cash',
  receipt_reference text,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.ld_expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to ld_expenses" ON public.ld_expenses FOR ALL USING (true) WITH CHECK (true);

-- 5. Add seniority_level to ld_staff for basic salary distribution
ALTER TABLE public.ld_staff
  ADD COLUMN IF NOT EXISTS seniority_level integer DEFAULT 1;

-- 6. Add base_price to ld_work_types for price autofill
ALTER TABLE public.ld_work_types
  ADD COLUMN IF NOT EXISTS base_price numeric DEFAULT 0;

-- 7. Create ld_client_custom_prices for per-client work type pricing (if not using ld_client_prices)
-- ld_client_prices already exists, so we just ensure it has what we need - it does.

-- 8. Add updated_at trigger for ld_expenses
CREATE TRIGGER set_ld_expenses_updated_at
  BEFORE UPDATE ON public.ld_expenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
