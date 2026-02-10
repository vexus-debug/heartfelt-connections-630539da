

## Phase 4: Live Dashboard, Dental Charts, Patient Profile & Reports

This final phase replaces all remaining mock/hardcoded data with real Supabase queries, and adds the missing database tables.

---

### 4A. New Database Tables

**Treatment Plans & Procedures**
- `treatment_plans` — tracks multi-step treatment plans per patient (name, status, total cost, paid amount, start/end dates)
- `treatment_plan_procedures` — individual steps within a plan (procedure name, status done/pending, date completed)

**Dental Chart Entries**
- `dental_chart_entries` — records per-tooth data for each patient (tooth number, procedure performed, status like filling/crown/cavity/extraction, date, notes, dentist who performed it)

**Activity Log**
- `activity_log` — auto-tracks clinic events like new patients, completed appointments, payments received, prescriptions created — used to power the dashboard's "Recent Activity" feed

All tables will have RLS policies matching the existing security model (authenticated staff can read, role-based write access).

---

### 4B. Dashboard Home — Live Stats & Data

Replace all hardcoded numbers with real-time Supabase queries:

- **Total Patients** — `COUNT(*)` from patients table
- **Today's Appointments** — count of appointments for today's date
- **Pending Payments** — count of invoices with status "pending" or "partial"
- **Monthly Revenue** — sum of payments received this month
- **Weekly Appointments Chart** — aggregated appointment counts for the current week
- **Revenue Chart** — aggregated monthly payment totals for the last 6 months
- **Today's Schedule Table** — real appointments for today, joined with patient names, staff names, and treatment names
- **Recent Activity Feed** — latest entries from the activity_log table
- **Welcome message** — show the logged-in user's actual name instead of hardcoded "Dr. Okonkwo"

---

### 4C. Patient Profile Page — Real Data Across All Tabs

Replace mock patient detail data with live queries by patient ID:

- **Overview Tab** — patient record from `patients` table (personal info, contact, emergency contact, medical history, allergies)
- **Dental History Tab** — appointments for this patient joined with treatment and staff names, ordered by date
- **Treatment Plans Tab** — from `treatment_plans` + `treatment_plan_procedures` tables
- **Billing Tab** — invoices for this patient from `invoices` table with payment status
- **Prescriptions Tab** — from `prescriptions` + `prescription_medications` tables for this patient

---

### 4D. Dental Charts Page — Database-Backed Tooth Records

- Patient selector will query from the real `patients` table
- Tooth chart data will come from `dental_chart_entries` table filtered by patient
- "Add Procedure" dialog will INSERT into `dental_chart_entries`
- Procedure history per tooth will query from the same table

---

### 4E. Reports Page — Live Analytics

Replace hardcoded chart data with real aggregated queries:

- **Revenue Trend** — monthly payment sums for the last 6 months
- **Treatment Distribution** — count of appointments grouped by treatment category
- **Weekly Appointment Trends** — appointment counts grouped by day of week
- **Dentist Performance** — appointments and revenue per staff member this month

---

### What You'll See When Done

- Dashboard shows real, up-to-date clinic numbers the moment you log in
- Patient profiles display complete real history across all tabs
- Dental charts persist tooth-by-tooth records in the database
- Reports reflect actual clinic performance data
- The mock data files (`mockDashboardData.ts`, `mockPatientDetails.ts`) can be safely removed

