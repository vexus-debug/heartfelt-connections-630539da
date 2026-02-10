

## Vista Dental Clinic — Missing Features & Enhancement Plan

After a thorough audit of all dashboard pages, hooks, database tables, and dialogs, here's what's **already working** and what's **still missing** for a complete dental clinic management system.

### ✅ Already Implemented (No Work Needed)
- Patient CRUD with edit dialog
- Staff management (add, edit) — admin only
- Inventory management (add, edit, restock, delete)
- Treatment catalog CRUD (add, edit, delete) — admin only
- Appointment booking, viewing, editing, status changes (start/complete/cancel)
- Appointment detail dialog with quick actions
- My Profile page with edit capability
- Settings: Clinic Profile (saves to DB), Notification Preferences (saves to DB), Roles & Access management (assign/remove roles)
- Billing/Invoices page
- Reports with real data (revenue, treatments, dentist performance)
- Dental charts with procedure entry
- Prescriptions, Lab orders
- Real notifications from database with mark read/mark all read
- Role-based access control across all pages

---

### 🔧 What's Still Missing

#### 1. Auto-Generated Notifications
**Problem:** The notifications table exists and the UI reads from it, but nothing **creates** notifications automatically. The system relies on manual inserts.

**What we'll add:**
- Database triggers or edge function logic to auto-create notifications when:
  - An appointment is booked or approaching (reminder)
  - A payment becomes overdue
  - A lab order is marked as completed
  - Inventory drops below minimum stock level
- Notifications will be created for relevant users based on their roles and notification preferences

---

#### 2. Walk-In Appointment Quick-Add
**Problem:** The `is_walk_in` field exists on appointments and displays in the detail dialog, but there's no dedicated "Walk-In" button for fast entry.

**What we'll add:**
- A "Walk-In" quick-add button on the Appointments page
- Simplified form (patient + treatment only, auto-fills today's date/time, marks `is_walk_in: true`)
- Auto-sets status to "in-progress"

---

#### 3. Notification Badge — Live Count
**Problem:** The sidebar shows a hardcoded badge of "5" for notifications instead of the real unread count.

**What we'll add:**
- Replace the hardcoded "5" with a live query of unread notification count
- Hide the badge when count is 0

---

#### 4. Activity Log Auto-Population
**Problem:** The dashboard shows "Recent Activity" from the `activity_log` table, but nothing writes to it automatically.

**What we'll add:**
- Database triggers to log key events: new patient registered, appointment completed, payment received, invoice created
- Each entry will record the event type, description, and related entity

---

#### 5. Reports — Date Range Filter & Export
**Problem:** Reports page shows data but has no date range picker and no way to export/download reports.

**What we'll add:**
- Date range selector for filtering revenue trends and appointment data
- A "Download CSV" button to export report data

---

#### 6. Patient Search & Filter Improvements
**Problem:** The patients list exists but lacks advanced filtering (by status, date range, etc.).

**What we'll add:**
- Filter by patient status (active/inactive)
- Sort options (name, registration date, last visit)

---

### Summary

| Feature | Impact | Complexity |
|---------|--------|------------|
| Auto-Generated Notifications | High | Medium |
| Activity Log Auto-Population | High | Medium |
| Live Notification Badge Count | Medium | Low |
| Walk-In Quick-Add | Medium | Low |
| Reports Date Filter & Export | Medium | Medium |
| Patient Search & Filters | Low | Low |

