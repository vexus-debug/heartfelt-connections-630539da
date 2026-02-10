

# Supabase Backend Implementation Plan for VistaDentalcare

## Current State

Your dashboard is fully built with working UI, forms, and dialog components -- but everything runs on hardcoded mock data. Nothing saves or persists. This plan will connect everything to your Supabase database so data is real, persistent, and ready for production.

---

## What This Plan Covers

We will implement the backend in **4 phases**, each building on the previous one. Each phase delivers working functionality you can test immediately.

---

## Phase 1: Authentication and Core Tables

**Why first:** Every other feature depends on knowing who is logged in and having the core data tables ready.

### 1A. Authentication (Login/Signup)
- Add a login page at `/login` with email + password
- Add signup for new staff accounts
- Protect all `/dashboard/*` routes so only logged-in users can access them
- Redirect unauthenticated users to `/login`

### 1B. Database Tables (via migrations)

The following tables will be created:

- **profiles** -- staff user profiles linked to auth.users (name, phone, role display)
- **user_roles** -- separate roles table (admin, dentist, assistant, hygienist, receptionist, accountant) for secure role-based access
- **patients** -- all patient data (name, phone, email, gender, DOB, address, blood group, emergency contact, medical history, allergies, referral source, status, registered date)
- **staff** -- clinic staff members (name, role, specialty, phone, email, status)
- **treatments** -- treatment catalog (name, category, price, duration, description)

### 1C. Row-Level Security (RLS)
- All tables will have RLS enabled
- Only authenticated users can read/write data
- A `has_role()` security definer function will be created to check roles without recursive RLS issues
- Admin users can manage staff and treatments; all authenticated staff can read patients and manage appointments

---

## Phase 2: Appointments, Prescriptions, and Lab Orders

These tables depend on patients, staff, and treatments from Phase 1.

### 2A. Database Tables

- **appointments** -- patient_id, staff_id (dentist), treatment_id, date, time, chair, status, is_walk_in, notes
- **prescriptions** -- patient_id, dentist_id, date, notes
- **prescription_medications** -- prescription_id, name, dosage, frequency, duration
- **lab_orders** -- patient_id, treatment_id, dentist_id, lab_work_type, lab_name, due_date, sent_date, status, notes

### 2B. Connect Forms to Database
- **Add Patient** dialog will INSERT into `patients` table
- **Book Appointment** dialog will INSERT into `appointments` table
- **Create Prescription** dialog will INSERT into `prescriptions` + `prescription_medications`
- **Create Lab Order** dialog will INSERT into `lab_orders`
- All list pages (Patients, Appointments, Prescriptions, Lab Work) will SELECT from Supabase instead of mock data

---

## Phase 3: Billing, Invoices, and Inventory

### 3A. Database Tables

- **invoices** -- patient_id, date, status (paid/pending/partial), discount_percent, payment_method, total, amount_paid
- **invoice_items** -- invoice_id, treatment_id, quantity, unit_price, line_total
- **payments** -- invoice_id, amount, payment_method, date (supports partial payments over time)
- **inventory** -- name, category, quantity, min_stock, unit, supplier, last_restocked

### 3B. Connect Forms to Database
- **Create Invoice** dialog will INSERT into `invoices` + `invoice_items`
- Billing page will query real invoices with totals
- Invoice detail view will show real line items and payment history
- Inventory page will read/write from `inventory` table

---

## Phase 4: Treatment Plans, Dental Charts, and Dashboard Stats

### 4A. Database Tables

- **treatment_plans** -- patient_id, name, status, total_cost, paid_amount, start_date, estimated_end
- **treatment_plan_procedures** -- plan_id, procedure_name, status (done/pending), date
- **dental_chart_entries** -- patient_id, tooth_number, procedure, status, date, notes, dentist_id
- **activity_log** -- auto-logged events (new patient, payment, appointment, etc.) for the dashboard feed

### 4B. Dashboard Home
- Replace hardcoded stats with real-time queries (total patients count, today's appointments, pending payments, monthly revenue)
- Recent activity feed from `activity_log` table
- Charts will query aggregated data

### 4C. Patient Profile Page
- All tabs (Overview, History, Plans, Billing, Prescriptions) will query real data by patient ID

---

## Technical Details

### Database Schema Design

```text
auth.users
    |
    +-- profiles (1:1, ON DELETE CASCADE)
    +-- user_roles (1:many, role enum)

patients
    |
    +-- appointments (many, FK to staff + treatments)
    +-- prescriptions (many, FK to staff)
    |       +-- prescription_medications (many)
    +-- lab_orders (many, FK to staff + treatments)
    +-- invoices (many)
    |       +-- invoice_items (many, FK to treatments)
    |       +-- payments (many)
    +-- treatment_plans (many)
    |       +-- treatment_plan_procedures (many)
    +-- dental_chart_entries (many)

staff (independent, linked to profiles via user_id where applicable)
treatments (independent catalog)
inventory (independent)
activity_log (references various tables)
```

### Security Architecture

- `has_role()` SECURITY DEFINER function for safe role checks
- RLS on every table
- Policies scoped to authenticated users
- Admin-only policies for managing staff, treatments, and inventory
- All dentists/staff can manage patients, appointments, billing

### Data Migration Approach

- Mock data files will be kept temporarily as fallback
- Each page will be updated to use React Query hooks (`useQuery`, `useMutation`) for Supabase calls
- Custom hooks like `usePatients()`, `useAppointments()`, `useInvoices()` will be created for reusability
- Toast notifications on successful create/update operations (already in place)
- Form dialogs will be updated to call Supabase mutations instead of just showing toasts

### What Changes Per Page

| Page | Current | After |
|------|---------|-------|
| Dashboard Home | Hardcoded stats | Live queries |
| Patients List | Mock array | `SELECT * FROM patients` |
| Patient Profile | Mock details | Queries by patient ID |
| Appointments | Mock by date | `SELECT * FROM appointments WHERE date = ?` |
| Billing | Inline array | `SELECT * FROM invoices` with joins |
| Prescriptions | Inline array | `SELECT * FROM prescriptions` with medications |
| Lab Work | Mock array | `SELECT * FROM lab_orders` |
| Inventory | Mock array | `SELECT * FROM inventory` |
| Staff | Mock array | `SELECT * FROM staff` |
| Treatments | Mock array | `SELECT * FROM treatments` |

### Implementation Order (step by step)

1. Create auth login/signup page + route protection
2. Run Phase 1 migrations (profiles, user_roles, patients, staff, treatments)
3. Seed initial data (treatments catalog, first admin user)
4. Update Patients page + Add Patient dialog to use Supabase
5. Run Phase 2 migrations (appointments, prescriptions, lab_orders)
6. Update Appointments, Prescriptions, Lab Work pages
7. Run Phase 3 migrations (invoices, inventory)
8. Update Billing, Inventory pages
9. Run Phase 4 migrations (treatment_plans, dental_charts, activity_log)
10. Update Dashboard Home with live stats
11. Update Patient Profile with real data across all tabs

---

## Important Notes

- **Authentication is required first** -- RLS policies depend on `auth.uid()` to know who the logged-in user is. No data will be accessible without logging in.
- This is a large implementation. We will tackle it phase by phase, and you can test each phase before moving to the next.
- The existing mock data files will remain as reference but will no longer be used once each section is connected.

