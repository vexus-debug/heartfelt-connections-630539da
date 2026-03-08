
-- Lab Dashboard Settings
CREATE TABLE public.ld_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_name text NOT NULL DEFAULT 'Vista Dental Lab',
  address text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  logo_url text DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

ALTER TABLE public.ld_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read ld_settings" ON public.ld_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage ld_settings" ON public.ld_settings FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

INSERT INTO public.ld_settings (lab_name) VALUES ('Vista Dental Lab');

-- Lab Dashboard Clients (Doctors/Clinics who send work)
CREATE TABLE public.ld_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_name text NOT NULL,
  doctor_name text NOT NULL,
  clinic_code text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  address text DEFAULT '',
  notes text DEFAULT '',
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ld_clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read ld_clients" ON public.ld_clients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin and lab_tech can insert ld_clients" ON public.ld_clients FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'lab_technician'));
CREATE POLICY "Admin and lab_tech can update ld_clients" ON public.ld_clients FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'lab_technician'));
CREATE POLICY "Admin can delete ld_clients" ON public.ld_clients FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Lab Dashboard Staff/Technicians
CREATE TABLE public.ld_staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'technician',
  specialty text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  status text NOT NULL DEFAULT 'active',
  user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ld_staff ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read ld_staff" ON public.ld_staff FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage ld_staff" ON public.ld_staff FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Lab Dashboard Work Types (services/tests offered)
CREATE TABLE public.ld_work_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  description text DEFAULT '',
  base_price numeric NOT NULL DEFAULT 0,
  estimated_days integer NOT NULL DEFAULT 3,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ld_work_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read ld_work_types" ON public.ld_work_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage ld_work_types" ON public.ld_work_types FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Lab Dashboard Cases (core entity)
CREATE TABLE public.ld_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number text NOT NULL DEFAULT '',
  client_id uuid REFERENCES public.ld_clients(id),
  patient_name text NOT NULL DEFAULT '',
  work_type_id uuid REFERENCES public.ld_work_types(id),
  work_type_name text NOT NULL DEFAULT '',
  assigned_technician_id uuid REFERENCES public.ld_staff(id),
  tooth_number integer,
  shade text DEFAULT '',
  instructions text DEFAULT '',
  job_description text DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  is_urgent boolean NOT NULL DEFAULT false,
  due_date date,
  received_date date DEFAULT CURRENT_DATE,
  started_date date,
  completed_date date,
  delivered_date date,
  delivery_method text DEFAULT '',
  lab_fee numeric NOT NULL DEFAULT 0,
  discount numeric DEFAULT 0,
  net_amount numeric DEFAULT 0,
  is_paid boolean NOT NULL DEFAULT false,
  remark text DEFAULT '',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ld_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read ld_cases" ON public.ld_cases FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin and lab_tech can insert ld_cases" ON public.ld_cases FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'lab_technician'));
CREATE POLICY "Admin and lab_tech can update ld_cases" ON public.ld_cases FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'lab_technician'));
CREATE POLICY "Admin can delete ld_cases" ON public.ld_cases FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Auto-generate case numbers
CREATE OR REPLACE FUNCTION public.generate_ld_case_number()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
DECLARE seq_num INT; date_str TEXT;
BEGIN
  date_str := to_char(NOW(), 'YYYYMMDD');
  SELECT COUNT(*) + 1 INTO seq_num FROM ld_cases WHERE case_number LIKE 'LD-' || date_str || '-%';
  NEW.case_number := 'LD-' || date_str || '-' || LPAD(seq_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_ld_case_number BEFORE INSERT ON public.ld_cases
FOR EACH ROW WHEN (NEW.case_number = '' OR NEW.case_number IS NULL)
EXECUTE FUNCTION public.generate_ld_case_number();

-- Auto net amount
CREATE OR REPLACE FUNCTION public.calculate_ld_case_net()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  NEW.net_amount := GREATEST(COALESCE(NEW.lab_fee, 0) - COALESCE(NEW.discount, 0), 0);
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_ld_case_net BEFORE INSERT OR UPDATE ON public.ld_cases
FOR EACH ROW EXECUTE FUNCTION public.calculate_ld_case_net();

-- Lab Dashboard Invoices
CREATE TABLE public.ld_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text NOT NULL DEFAULT '',
  case_id uuid REFERENCES public.ld_cases(id),
  client_id uuid REFERENCES public.ld_clients(id),
  patient_name text DEFAULT '',
  invoice_date date NOT NULL DEFAULT CURRENT_DATE,
  subtotal numeric NOT NULL DEFAULT 0,
  discount numeric NOT NULL DEFAULT 0,
  total_amount numeric NOT NULL DEFAULT 0,
  amount_paid numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'unpaid',
  notes text DEFAULT '',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ld_invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read ld_invoices" ON public.ld_invoices FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin and lab_tech can insert ld_invoices" ON public.ld_invoices FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'lab_technician'));
CREATE POLICY "Admin and lab_tech can update ld_invoices" ON public.ld_invoices FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'lab_technician'));
CREATE POLICY "Admin can delete ld_invoices" ON public.ld_invoices FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Auto invoice number
CREATE OR REPLACE FUNCTION public.generate_ld_invoice_number()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
DECLARE seq_num INT; date_str TEXT;
BEGIN
  date_str := to_char(NOW(), 'YYYYMMDD');
  SELECT COUNT(*) + 1 INTO seq_num FROM ld_invoices WHERE invoice_number LIKE 'LDI-' || date_str || '-%';
  NEW.invoice_number := 'LDI-' || date_str || '-' || LPAD(seq_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_ld_invoice_number BEFORE INSERT ON public.ld_invoices
FOR EACH ROW WHEN (NEW.invoice_number = '' OR NEW.invoice_number IS NULL)
EXECUTE FUNCTION public.generate_ld_invoice_number();

-- Lab Dashboard Payments
CREATE TABLE public.ld_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES public.ld_invoices(id) NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  payment_method text NOT NULL DEFAULT 'cash',
  reference text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ld_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read ld_payments" ON public.ld_payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin and lab_tech can insert ld_payments" ON public.ld_payments FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'lab_technician'));
CREATE POLICY "Admin can delete ld_payments" ON public.ld_payments FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
