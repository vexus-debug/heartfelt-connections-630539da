
-- Create lab_clients table for managing external clinic/doctor clients
CREATE TABLE public.lab_clients (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_name text NOT NULL,
  doctor_name text NOT NULL,
  clinic_code text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  address text DEFAULT '',
  notes text DEFAULT '',
  status text NOT NULL DEFAULT 'active',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lab_clients ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Authenticated users can read lab_clients"
  ON public.lab_clients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin and lab staff can insert lab_clients"
  ON public.lab_clients FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'lab_technician'::app_role));

CREATE POLICY "Admin and lab staff can update lab_clients"
  ON public.lab_clients FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'lab_technician'::app_role));

CREATE POLICY "Admins can delete lab_clients"
  ON public.lab_clients FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add updated_at trigger
CREATE TRIGGER update_lab_clients_updated_at
  BEFORE UPDATE ON public.lab_clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add lab_client_id to lab_cases to link cases to clients
ALTER TABLE public.lab_cases ADD COLUMN lab_client_id uuid REFERENCES public.lab_clients(id);

-- Add deposit_amount to lab_invoices for partial deposit tracking
ALTER TABLE public.lab_invoices ADD COLUMN deposit_amount numeric NOT NULL DEFAULT 0;

-- Add lab settings table for lab name/branding
CREATE TABLE public.lab_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lab_name text NOT NULL DEFAULT 'Impressions ''n'' Teeth Ltd',
  address text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid
);

ALTER TABLE public.lab_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read lab_settings"
  ON public.lab_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert lab_settings"
  ON public.lab_settings FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update lab_settings"
  ON public.lab_settings FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default lab settings
INSERT INTO public.lab_settings (lab_name) VALUES ('Impressions ''n'' Teeth Ltd');
