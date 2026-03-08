
-- ld_case_images: Photos for lab cases
CREATE TABLE public.ld_case_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_case_id uuid NOT NULL REFERENCES public.ld_cases(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  description text DEFAULT '',
  uploaded_by uuid DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ld_case_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read ld_case_images" ON public.ld_case_images FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin and lab_tech can insert ld_case_images" ON public.ld_case_images FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'lab_technician'::app_role));
CREATE POLICY "Admin can delete ld_case_images" ON public.ld_case_images FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- ld_case_notes: Comments/notes on cases
CREATE TABLE public.ld_case_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_case_id uuid NOT NULL REFERENCES public.ld_cases(id) ON DELETE CASCADE,
  note text NOT NULL,
  user_id uuid DEFAULT NULL,
  user_name text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ld_case_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read ld_case_notes" ON public.ld_case_notes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin and lab_tech can insert ld_case_notes" ON public.ld_case_notes FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'lab_technician'::app_role));
CREATE POLICY "Admin can delete ld_case_notes" ON public.ld_case_notes FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- ld_case_history: Status change timeline
CREATE TABLE public.ld_case_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_case_id uuid NOT NULL REFERENCES public.ld_cases(id) ON DELETE CASCADE,
  field_changed text NOT NULL,
  old_value text DEFAULT NULL,
  new_value text DEFAULT NULL,
  changed_by uuid DEFAULT NULL,
  changed_by_name text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ld_case_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read ld_case_history" ON public.ld_case_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "System can insert ld_case_history" ON public.ld_case_history FOR INSERT TO authenticated WITH CHECK (true);

-- ld_quality_checks: QC checklist items per case
CREATE TABLE public.ld_quality_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_case_id uuid NOT NULL REFERENCES public.ld_cases(id) ON DELETE CASCADE,
  check_item text NOT NULL,
  is_passed boolean NOT NULL DEFAULT false,
  checked_by uuid DEFAULT NULL,
  checked_by_name text DEFAULT '',
  checked_at timestamptz DEFAULT NULL,
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ld_quality_checks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read ld_quality_checks" ON public.ld_quality_checks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin and lab_tech can insert ld_quality_checks" ON public.ld_quality_checks FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'lab_technician'::app_role));
CREATE POLICY "Admin and lab_tech can update ld_quality_checks" ON public.ld_quality_checks FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'lab_technician'::app_role));

-- ld_credit_notes: Credit/debit adjustments
CREATE TABLE public.ld_credit_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES public.ld_invoices(id) ON DELETE SET NULL,
  client_id uuid REFERENCES public.ld_clients(id) ON DELETE SET NULL,
  case_id uuid REFERENCES public.ld_cases(id) ON DELETE SET NULL,
  type text NOT NULL DEFAULT 'credit',
  reason text NOT NULL DEFAULT '',
  amount numeric NOT NULL DEFAULT 0,
  note_number text NOT NULL DEFAULT '',
  created_by uuid DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ld_credit_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read ld_credit_notes" ON public.ld_credit_notes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can insert ld_credit_notes" ON public.ld_credit_notes FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin can delete ld_credit_notes" ON public.ld_credit_notes FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Add delivery tracking fields to ld_cases
ALTER TABLE public.ld_cases ADD COLUMN IF NOT EXISTS courier_name text DEFAULT '';
ALTER TABLE public.ld_cases ADD COLUMN IF NOT EXISTS tracking_number text DEFAULT '';
ALTER TABLE public.ld_cases ADD COLUMN IF NOT EXISTS delivery_notes text DEFAULT '';
ALTER TABLE public.ld_cases ADD COLUMN IF NOT EXISTS qc_passed boolean DEFAULT false;
ALTER TABLE public.ld_cases ADD COLUMN IF NOT EXISTS qc_passed_at timestamptz DEFAULT NULL;
ALTER TABLE public.ld_cases ADD COLUMN IF NOT EXISTS qc_passed_by text DEFAULT '';

-- Auto-generate credit note numbers
CREATE OR REPLACE FUNCTION public.generate_ld_credit_note_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE seq_num INT; date_str TEXT;
BEGIN
  date_str := to_char(NOW(), 'YYYYMMDD');
  SELECT COUNT(*) + 1 INTO seq_num FROM ld_credit_notes WHERE note_number LIKE 'LCN-' || date_str || '-%';
  NEW.note_number := 'LCN-' || date_str || '-' || LPAD(seq_num::TEXT, 4, '0');
  RETURN NEW;
END;
$function$;

CREATE TRIGGER generate_ld_credit_note_number_trigger
  BEFORE INSERT ON public.ld_credit_notes
  FOR EACH ROW EXECUTE FUNCTION public.generate_ld_credit_note_number();
