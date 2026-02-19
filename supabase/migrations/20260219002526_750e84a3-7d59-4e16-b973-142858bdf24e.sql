
-- Clear old placeholder rules
DELETE FROM lab_allocation_rules;

-- Insert the correct lab allocation rules
INSERT INTO lab_allocation_rules (category, percentage, is_active) VALUES
  ('Expenses',        10.000, true),
  ('Dental Material', 20.000, true),
  ('Rent',            10.000, true),
  ('Output',          20.026, true),
  ('Basic Salary',    10.013, true),
  ('Savings',         13.800, true),
  ('Referral',        13.400, true),
  ('Tithe',            2.800, true);
