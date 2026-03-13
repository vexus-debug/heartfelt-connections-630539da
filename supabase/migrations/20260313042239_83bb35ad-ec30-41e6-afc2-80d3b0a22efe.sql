
-- Add new columns to ld_cases for extended features
ALTER TABLE public.ld_cases 
  ADD COLUMN IF NOT EXISTS received_date text,
  ADD COLUMN IF NOT EXISTS date_out text,
  ADD COLUMN IF NOT EXISTS external_lab_id uuid REFERENCES public.ld_external_labs(id),
  ADD COLUMN IF NOT EXISTS courier_amount numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS express_surcharge numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS clasp_units integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS clasp_cost numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS gingival_masking boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS gingival_masking_cost numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS completion_type text DEFAULT 'full',
  ADD COLUMN IF NOT EXISTS deposit_amount numeric DEFAULT 0;

-- Add entry_clerk role to app_role enum if not exists
DO $$ BEGIN
  ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'lab_entry_clerk';
EXCEPTION WHEN duplicate_object THEN null;
END $$;
