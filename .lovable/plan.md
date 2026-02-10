

# 🦷 Dental Clinic Management System — Dashboard

A comprehensive, light-themed dental clinic management dashboard integrated with your existing public website. We'll build the complete UI with mock data first, then connect Supabase later.

## Design Direction
- **Clean, light theme** with a professional medical feel
- **Sidebar navigation** with collapsible sections (inspired by the reference image)
- **Card-based dashboard** with stats, charts, and quick-access widgets
- Color accents in teal/blue (dental/medical feel) with the existing brand palette

---

## Phase 1: Dashboard Layout & Core Shell

### Sidebar Navigation
- Collapsible sidebar with icon-only mini mode
- Sections: General, Clinical, Finance, Admin, Settings
- User profile & role badge at bottom
- Clinic logo at top

### Top Header Bar
- Search bar (global search across patients, appointments)
- Notification bell with badge count
- User avatar with dropdown (profile, settings, logout)

### Main Dashboard (Home)
- **Stat cards**: Total Patients, Today's Appointments, Pending Payments, Revenue (this month)
- **Charts**: Weekly appointment trends, revenue overview (bar/line chart)
- **Today's Schedule**: List of upcoming appointments with patient name, dentist, time, chair, status
- **Quick Actions**: New Patient, Book Appointment, Create Invoice
- **Recent Activity** feed

---

## Phase 2: Patient Management

### Patient List Page
- Searchable, filterable table with patient ID, name, phone, last visit, status
- Advanced filters (date range, treatment type, dentist)
- Add new patient button

### Patient Profile Page
- **Bio & Contact** tab: Personal info, emergency contact, photo
- **Dental History** tab: Visit timeline, procedures performed
- **Treatment Plans** tab: Active/completed plans with progress
- **Dental Chart** tab: Interactive tooth chart (clickable teeth with procedure notes, FDI numbering)
- **Before/After Photos** tab: Image gallery per treatment
- **Billing** tab: Payment history, outstanding balance
- **Prescriptions** tab: Prescription history

---

## Phase 3: Appointments & Scheduling

### Appointment Calendar
- Week/day view with chair columns (Chair 1, Chair 2, etc.)
- Color-coded by status: Scheduled, In-Progress, Completed, Cancelled
- Drag to reschedule (future enhancement)
- Click to view/edit appointment details

### Appointment Booking Form
- Patient selection (search existing or register new)
- Dentist selection with availability display
- Chair/room allocation
- Date & time slot picker
- Treatment type selection
- Walk-in toggle
- Notes field

---

## Phase 4: Clinical Features

### Dental Charting
- Visual tooth map (adult 32 teeth, FDI numbering)
- Click a tooth → add procedure, notes, status (healthy, cavity, filling, extraction, etc.)
- Color-coded tooth status indicators
- Planned vs. completed treatment view

### Treatment & Procedures
- Treatment catalog with pricing (scaling, filling, extraction, braces, etc.)
- Create treatment plans with multi-visit scheduling
- Track progress per visit
- Dentist notes per procedure

### Prescriptions
- Create digital prescriptions from templates
- Medication search, dosage, frequency, duration
- Prescription history per patient
- Print-friendly prescription view

---

## Phase 5: Billing & Finance

### Billing Page
- Treatment-based invoice generation
- Partial payment support with balance tracking
- Payment method selection (cash, transfer, POS, card)
- Discount application
- Invoice & receipt preview (printable)

### Financial Overview
- Revenue dashboard with charts
- Outstanding payments list
- Daily/monthly collection summary
- Payment history log

---

## Phase 6: Lab Work Management

### Lab Orders
- Create lab requests (crowns, bridges, dentures) linked to patient & treatment
- External lab selection
- Due date tracking
- Status pipeline: Sent → In Progress → Received
- Attach lab result images/files

---

## Phase 7: Staff & Inventory

### Dentist & Staff Management
- Staff directory with profiles (specialty, role, contact)
- Shift schedule view (weekly calendar)
- Active/inactive status toggle

### Inventory (Basic)
- Item list with stock levels
- Low-stock alerts (visual indicators)
- Usage log
- Supplier directory

---

## Phase 8: Reports & Settings

### Reports Dashboard
- Daily/weekly patient count charts
- Revenue summary with filters
- Most common treatments breakdown
- Dentist performance metrics (appointments, revenue)
- Outstanding payments report

### Settings
- Clinic profile (name, address, hours, logo)
- User roles & permissions management (Admin, Dentist, Assistant, Receptionist, Accountant)
- Notification preferences
- Treatment & pricing catalog management

---

## Phase 9: Notifications & Integration

### Notification Center
- In-app notification panel
- Appointment reminders
- Follow-up reminders
- Payment due alerts
- Lab completion notifications

### Website Integration
- Shared appointment flow: patients book on the public site → appears in the dashboard
- Consistent patient records between website bookings and dashboard

---

## Navigation Structure

```
📊 Dashboard (Home)
👥 Patients
   → Patient List
   → Add Patient
📅 Appointments
   → Calendar View
   → Book Appointment
🦷 Clinical
   → Dental Charts
   → Treatment Plans
   → Prescriptions
💰 Billing
   → Invoices
   → Payments
   → Financial Reports
🔬 Lab Work
👨‍⚕️ Staff
📦 Inventory
📈 Reports
🔔 Notifications
⚙️ Settings
```

All pages will be built with realistic mock data and designed to be backend-ready for Supabase integration in a future phase.

