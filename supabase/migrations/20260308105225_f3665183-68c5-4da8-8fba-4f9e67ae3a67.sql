-- =============================================
-- LAB DASHBOARD EXTENDED FEATURES MIGRATION
-- =============================================

-- 1. RECURRING WORK ORDERS (Standing orders for regular clients)
CREATE TABLE ld_recurring_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES ld_clients(id) ON DELETE CASCADE,
  work_type_id uuid REFERENCES ld_work_types(id) ON DELETE SET NULL,
  work_type_name text NOT NULL DEFAULT '',
  patient_name text NOT NULL DEFAULT '',
  frequency text NOT NULL DEFAULT 'monthly', -- weekly, bi-weekly, monthly, quarterly
  next_due_date date,
  last_generated_date date,
  lab_fee numeric NOT NULL DEFAULT 0,
  shade text DEFAULT '',
  instructions text DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ld_recurring_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin and lab_tech can manage ld_recurring_orders" ON ld_recurring_orders
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'lab_technician'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'lab_technician'));

CREATE POLICY "Authenticated can read ld_recurring_orders" ON ld_recurring_orders
  FOR SELECT TO authenticated USING (true);

-- 2. EXTERNAL LAB OUTSOURCING
CREATE TABLE ld_external_labs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact_person text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  address text DEFAULT '',
  specialties text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'active',
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ld_external_labs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage ld_external_labs" ON ld_external_labs
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can read ld_external_labs" ON ld_external_labs
  FOR SELECT TO authenticated USING (true);

CREATE TABLE ld_outsourced_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES ld_cases(id) ON DELETE CASCADE,
  external_lab_id uuid REFERENCES ld_external_labs(id) ON DELETE SET NULL,
  sent_date date DEFAULT CURRENT_DATE,
  expected_return_date date,
  actual_return_date date,
  cost numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'sent', -- sent, in-progress, returned, issue
  notes text DEFAULT '',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ld_outsourced_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin and lab_tech can manage ld_outsourced_cases" ON ld_outsourced_cases
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'lab_technician'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'lab_technician'));

CREATE POLICY "Authenticated can read ld_outsourced_cases" ON ld_outsourced_cases
  FOR SELECT TO authenticated USING (true);

-- 3. BATCH SHIPMENTS
CREATE TABLE ld_shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_number text NOT NULL DEFAULT '',
  client_id uuid REFERENCES ld_clients(id) ON DELETE SET NULL,
  shipment_date date NOT NULL DEFAULT CURRENT_DATE,
  delivery_method text NOT NULL DEFAULT 'pickup', -- pickup, delivery, courier
  courier_name text DEFAULT '',
  tracking_number text DEFAULT '',
  status text NOT NULL DEFAULT 'pending', -- pending, dispatched, delivered
  total_cases integer NOT NULL DEFAULT 0,
  notes text DEFAULT '',
  dispatched_by uuid,
  dispatched_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ld_shipments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin and lab_tech can manage ld_shipments" ON ld_shipments
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'lab_technician'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'lab_technician'));

CREATE POLICY "Authenticated can read ld_shipments" ON ld_shipments
  FOR SELECT TO authenticated USING (true);

CREATE TABLE ld_shipment_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid REFERENCES ld_shipments(id) ON DELETE CASCADE,
  case_id uuid REFERENCES ld_cases(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(shipment_id, case_id)
);

ALTER TABLE ld_shipment_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin and lab_tech can manage ld_shipment_cases" ON ld_shipment_cases
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'lab_technician'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'lab_technician'));

CREATE POLICY "Authenticated can read ld_shipment_cases" ON ld_shipment_cases
  FOR SELECT TO authenticated USING (true);

-- 4. MATERIAL TRACKING PER CASE (COGS)
CREATE TABLE ld_case_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES ld_cases(id) ON DELETE CASCADE,
  inventory_id uuid REFERENCES ld_inventory(id) ON DELETE SET NULL,
  material_name text NOT NULL,
  quantity_used numeric NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT 'pcs',
  unit_cost numeric NOT NULL DEFAULT 0,
  total_cost numeric NOT NULL DEFAULT 0,
  used_by uuid,
  used_at timestamptz NOT NULL DEFAULT now(),
  notes text DEFAULT ''
);

ALTER TABLE ld_case_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin and lab_tech can manage ld_case_materials" ON ld_case_materials
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'lab_technician'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'lab_technician'));

CREATE POLICY "Authenticated can read ld_case_materials" ON ld_case_materials
  FOR SELECT TO authenticated USING (true);

-- 5. EQUIPMENT MAINTENANCE
CREATE TABLE ld_equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  model text DEFAULT '',
  serial_number text DEFAULT '',
  purchase_date date,
  warranty_expiry date,
  status text NOT NULL DEFAULT 'operational', -- operational, needs-service, out-of-service
  location text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ld_equipment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage ld_equipment" ON ld_equipment
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can read ld_equipment" ON ld_equipment
  FOR SELECT TO authenticated USING (true);

CREATE TABLE ld_equipment_maintenance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id uuid REFERENCES ld_equipment(id) ON DELETE CASCADE,
  maintenance_type text NOT NULL DEFAULT 'routine', -- routine, repair, calibration
  maintenance_date date NOT NULL DEFAULT CURRENT_DATE,
  next_maintenance_date date,
  performed_by text DEFAULT '',
  cost numeric DEFAULT 0,
  description text DEFAULT '',
  notes text DEFAULT '',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ld_equipment_maintenance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage ld_equipment_maintenance" ON ld_equipment_maintenance
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can read ld_equipment_maintenance" ON ld_equipment_maintenance
  FOR SELECT TO authenticated USING (true);

-- 6. CLIENT PRICE LISTS (Custom pricing per client)
CREATE TABLE ld_client_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES ld_clients(id) ON DELETE CASCADE,
  work_type_id uuid REFERENCES ld_work_types(id) ON DELETE CASCADE,
  custom_price numeric NOT NULL DEFAULT 0,
  discount_percent numeric DEFAULT 0,
  effective_from date DEFAULT CURRENT_DATE,
  effective_to date,
  notes text DEFAULT '',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(client_id, work_type_id)
);

ALTER TABLE ld_client_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage ld_client_prices" ON ld_client_prices
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can read ld_client_prices" ON ld_client_prices
  FOR SELECT TO authenticated USING (true);

-- 7. WARRANTY TRACKING
CREATE TABLE ld_warranties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES ld_cases(id) ON DELETE CASCADE,
  warranty_months integer NOT NULL DEFAULT 12,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'active', -- active, expired, claimed
  claim_date date,
  claim_reason text DEFAULT '',
  claim_resolution text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ld_warranties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin and lab_tech can manage ld_warranties" ON ld_warranties
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'lab_technician'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'lab_technician'));

CREATE POLICY "Authenticated can read ld_warranties" ON ld_warranties
  FOR SELECT TO authenticated USING (true);

-- 8. CLIENT COMMUNICATION LOG
CREATE TABLE ld_communications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES ld_clients(id) ON DELETE CASCADE,
  case_id uuid REFERENCES ld_cases(id) ON DELETE SET NULL,
  communication_type text NOT NULL DEFAULT 'call', -- call, email, whatsapp, in-person
  direction text NOT NULL DEFAULT 'outgoing', -- incoming, outgoing
  subject text DEFAULT '',
  content text DEFAULT '',
  contact_person text DEFAULT '',
  communicated_by uuid,
  communicated_by_name text DEFAULT '',
  communicated_at timestamptz NOT NULL DEFAULT now(),
  follow_up_required boolean DEFAULT false,
  follow_up_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ld_communications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin and lab_tech can manage ld_communications" ON ld_communications
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'lab_technician'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'lab_technician'));

CREATE POLICY "Authenticated can read ld_communications" ON ld_communications
  FOR SELECT TO authenticated USING (true);

-- 9. DIGITAL FILES (STL/CAD)
CREATE TABLE ld_digital_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES ld_cases(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL DEFAULT 'stl', -- stl, obj, ply, dcm, other
  file_size_kb integer DEFAULT 0,
  description text DEFAULT '',
  uploaded_by uuid,
  uploaded_by_name text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ld_digital_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin and lab_tech can manage ld_digital_files" ON ld_digital_files
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'lab_technician'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'lab_technician'));

CREATE POLICY "Authenticated can read ld_digital_files" ON ld_digital_files
  FOR SELECT TO authenticated USING (true);

-- 10. SHADE LIBRARY
CREATE TABLE ld_shade_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shade_code text NOT NULL UNIQUE,
  shade_name text NOT NULL,
  shade_system text NOT NULL DEFAULT 'vita-classic', -- vita-classic, vita-3d, chromascop, other
  color_hex text DEFAULT '',
  image_url text DEFAULT '',
  description text DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ld_shade_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage ld_shade_library" ON ld_shade_library
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can read ld_shade_library" ON ld_shade_library
  FOR SELECT TO authenticated USING (true);

-- 11. TECHNICIAN SKILLS MATRIX
CREATE TABLE ld_technician_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  technician_id uuid REFERENCES ld_staff(id) ON DELETE CASCADE,
  work_type_id uuid REFERENCES ld_work_types(id) ON DELETE CASCADE,
  proficiency_level text NOT NULL DEFAULT 'intermediate', -- beginner, intermediate, expert
  certified boolean DEFAULT false,
  certification_date date,
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(technician_id, work_type_id)
);

ALTER TABLE ld_technician_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage ld_technician_skills" ON ld_technician_skills
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can read ld_technician_skills" ON ld_technician_skills
  FOR SELECT TO authenticated USING (true);

-- 12. DISPATCH/PICKUP SCHEDULING
CREATE TABLE ld_pickup_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES ld_clients(id) ON DELETE CASCADE,
  pickup_date date NOT NULL,
  pickup_time time,
  pickup_type text NOT NULL DEFAULT 'pickup', -- pickup, delivery
  driver_name text DEFAULT '',
  driver_phone text DEFAULT '',
  status text NOT NULL DEFAULT 'scheduled', -- scheduled, in-progress, completed, cancelled
  estimated_cases integer DEFAULT 0,
  notes text DEFAULT '',
  completed_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ld_pickup_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin and lab_tech can manage ld_pickup_schedules" ON ld_pickup_schedules
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'lab_technician'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'lab_technician'));

CREATE POLICY "Authenticated can read ld_pickup_schedules" ON ld_pickup_schedules
  FOR SELECT TO authenticated USING (true);

-- Create storage bucket for digital files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('ld-digital-files', 'ld-digital-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for digital files
CREATE POLICY "Authenticated users can upload ld-digital-files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'ld-digital-files');

CREATE POLICY "Anyone can view ld-digital-files" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'ld-digital-files');

CREATE POLICY "Admin can delete ld-digital-files" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'ld-digital-files' AND has_role(auth.uid(), 'admin'));