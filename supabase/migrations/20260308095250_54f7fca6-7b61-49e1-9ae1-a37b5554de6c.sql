
-- 1. Allow receptionists to insert lab_cases
DROP POLICY IF EXISTS "Clinic and lab staff can insert lab_cases" ON public.lab_cases;
CREATE POLICY "Clinic and lab staff can insert lab_cases"
ON public.lab_cases FOR INSERT TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'dentist'::app_role)
  OR has_role(auth.uid(), 'lab_technician'::app_role)
  OR has_role(auth.uid(), 'receptionist'::app_role)
);

-- 2. Add due_date to ld_invoices
ALTER TABLE public.ld_invoices ADD COLUMN IF NOT EXISTS due_date date DEFAULT NULL;

-- 3. Add remark and editable payment_date to ld_payments
ALTER TABLE public.ld_payments ADD COLUMN IF NOT EXISTS remark text DEFAULT '';

-- 4. Add remark to payments table (clinic side)
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS remark text DEFAULT '';

-- 5. Add due_date to lab_invoices  
ALTER TABLE public.lab_invoices ADD COLUMN IF NOT EXISTS due_date date DEFAULT NULL;
