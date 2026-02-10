

## Phase 2: Admin Role Assignment + Appointments, Prescriptions & Lab Orders

### Step 1: Assign Admin Role
- Insert admin role for your account (`obayomioladayo50@gmail.com`) into the `user_roles` table
- Verify login works and dashboard is accessible

### Step 2: Create Database Tables
Create the following tables via migrations with proper RLS policies:

**Appointments Table**
- Links to patients, staff (dentist), and treatments
- Fields: date, time, chair, status (scheduled/completed/cancelled/no-show), walk-in flag, notes
- All authenticated staff can read; staff can create/update; admins can delete

**Prescriptions Table**
- Links to patients and staff (prescribing dentist)
- Fields: date, notes/diagnosis
- Child table: **prescription_medications** with medication name, dosage, frequency, duration

**Lab Orders Table**
- Links to patients, staff (dentist), and treatments
- Fields: lab work type, lab name, due date, sent date, received date, status (pending/sent/in-progress/completed), notes

### Step 3: Connect Existing Forms to Supabase
Replace mock data usage in each dialog/page:

- **Book Appointment Dialog** → inserts into `appointments` table, selects real patients/staff/treatments for dropdowns
- **Appointments Page** → queries appointments with patient and dentist names joined, filtered by date
- **Create Prescription Dialog** → inserts into `prescriptions` + `prescription_medications`
- **Prescriptions Page** → queries prescriptions with medications and patient info
- **Create Lab Order Dialog** → inserts into `lab_orders`
- **Lab Work Page** → queries lab orders with patient and treatment info

### Step 4: Create Reusable Data Hooks
- `useAppointments()` — fetch, create, update appointments with React Query
- `usePrescriptions()` — fetch, create prescriptions with medications
- `useLabOrders()` — fetch, create, update lab orders
- All hooks use `useQuery`/`useMutation` with toast notifications on success/error

### Step 5: Update Patients & Staff Pages
- **Patients Page** → already has the table, switch from mock data to `useQuery` from Supabase
- **Add Patient Dialog** → insert into `patients` table with mutation
- **Staff Page** → query from `staff` table instead of mock data
- **Treatments Page** → query from `treatments` table instead of mock data

### What You'll Be Able to Do After This Phase
- Log in as admin and access the dashboard
- Add real patients that persist in the database
- Book appointments linked to real patients, dentists, and treatments
- Create prescriptions with multiple medications
- Create and track lab orders
- View all data in list pages with real-time updates

