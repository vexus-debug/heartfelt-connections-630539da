
-- Lab Inventory table
CREATE TABLE public.ld_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  quantity INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'pcs',
  min_stock INTEGER NOT NULL DEFAULT 5,
  supplier TEXT DEFAULT '',
  last_restocked DATE DEFAULT NULL,
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ld_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read ld_inventory" ON public.ld_inventory
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin and lab_tech can insert ld_inventory" ON public.ld_inventory
  FOR INSERT TO authenticated WITH CHECK (
    has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'lab_technician'::app_role)
  );

CREATE POLICY "Admin and lab_tech can update ld_inventory" ON public.ld_inventory
  FOR UPDATE TO authenticated USING (
    has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'lab_technician'::app_role)
  );

CREATE POLICY "Admin can delete ld_inventory" ON public.ld_inventory
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Lab Activity Log table
CREATE TABLE public.ld_activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  description TEXT NOT NULL,
  entity_type TEXT DEFAULT NULL,
  entity_id UUID DEFAULT NULL,
  user_id UUID DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ld_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin and lab_tech can read ld_activity_log" ON public.ld_activity_log
  FOR SELECT TO authenticated USING (
    has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'lab_technician'::app_role)
  );

CREATE POLICY "System can insert ld_activity_log" ON public.ld_activity_log
  FOR INSERT TO authenticated WITH CHECK (true);
