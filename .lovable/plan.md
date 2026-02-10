

## Vista Dental Clinic Management System — Enhancement Plan

After a thorough review of all dashboard pages, here's what needs to be built to make this a complete, functional dental clinic management system.

---

### 1. 🔧 Make Patient Data Editable
**Current state:** Patient profile is read-only. No way to edit personal info, contact details, medical history, or allergies after creation.

**What we'll add:**
- Edit button on the patient profile page that opens an edit form
- Inline editing for personal info, contact details, emergency contacts, medical history, and allergies
- Ability to change patient status (active/inactive)
- Save changes to the database with proper validation

---

### 2. 🔧 Make Staff Data Editable (Admin Only)
**Current state:** Staff page is display-only — no way to add, edit, or manage staff members.

**What we'll add:**
- "Add Staff" button and dialog for creating new staff members
- Edit dialog for existing staff (name, role, phone, email, specialty, status)
- Ability to deactivate staff members
- Admin-only access for all staff management actions

---

### 3. 🔧 Make Inventory Items Editable
**Current state:** Inventory items can be added and restocked but not edited or deleted.

**What we'll add:**
- Edit button on each inventory row to modify item details (name, category, unit, min stock, supplier)
- Delete option for removing inventory items (admin only)

---

### 4. 👤 Staff Member Own Profile Page
**Current state:** No way for logged-in staff to view or edit their own profile.

**What we'll add:**
- New "My Profile" page at `/dashboard/profile` accessible to all roles
- Display the staff member's name, email, phone, role, and avatar
- Allow editing of own name, phone number, and avatar
- Link in the sidebar footer (click on profile name to go to profile page)

---

### 5. ⚙️ Functional Settings — Roles & Access Management
**Current state:** Settings page is entirely static/decorative. The "Roles & Access" tab shows roles but the "Configure" buttons don't work. Clinic profile changes don't save.

**What we'll add:**
- **Roles & Access tab (Admin only):**
  - List all users with their assigned roles
  - Ability to assign/remove roles to users (admin, dentist, receptionist, hygienist, assistant, accountant)
  - Visual display of what each role can access
- **Clinic Profile tab:** Wire up the save button to actually persist clinic settings (store in a `clinic_settings` table or similar)
- **Notification Preferences tab:** Wire up toggles to save preferences per user

---

### 6. 📋 Missing Appointment Management Features
**Current state:** Appointments can be booked and viewed, but not edited or cancelled from the list/schedule view.

**What we'll add:**
- Click on an appointment in schedule/list view to see details
- Edit appointment (change time, chair, dentist, status)
- Cancel/complete appointment with status updates
- Walk-in appointment quick-add

---

### 7. 🔔 Real Notifications System
**Current state:** Notifications page uses hardcoded mock data.

**What we'll add:**
- Wire notifications to real database (create `notifications` table)
- Mark individual notifications as read
- Mark all as read functionality
- Auto-generate notifications for: appointment reminders, overdue payments, lab work completion, low inventory stock

---

### 8. 🧾 Treatment Catalog Management (Admin)
**Current state:** Treatments page is read-only — no way to add, edit, or remove treatments/procedures.

**What we'll add:**
- "Add Treatment" button and dialog (admin only)
- Edit treatment details (name, category, price, duration, description)
- Delete treatment option (admin only)

---

### Summary of Priority
| Feature | Impact | Roles Affected |
|---------|--------|---------------|
| Editable Patient Data | High | All clinical staff |
| Editable Staff + Add Staff | High | Admin |
| Staff Own Profile | High | All roles |
| Settings — Roles & Access | High | Admin |
| Appointment Edit/Cancel | High | Dentist, Receptionist |
| Editable Inventory | Medium | Admin, Accountant |
| Treatment Catalog Mgmt | Medium | Admin |
| Real Notifications | Medium | All roles |

