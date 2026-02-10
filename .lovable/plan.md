

## Role-Based Dashboard Access Control

Currently all 6 roles (admin, dentist, assistant, hygienist, receptionist, accountant) see the exact same sidebar and can access every page. This plan will restrict each role to only see and access the pages relevant to their job.

---

### Role-to-Page Access Matrix

| Page | Admin | Dentist | Receptionist | Hygienist | Assistant | Accountant |
|------|-------|---------|--------------|-----------|-----------|------------|
| Dashboard Home | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Patients | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Patient Profile | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Appointments | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Dental Charts | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Treatments | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Prescriptions | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Billing | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Reports | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Lab Work | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| Staff | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Inventory | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Settings | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Notifications | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### Feature 1: Dynamic Sidebar Navigation

The sidebar will only show menu items the logged-in user's role is allowed to access. Each nav item will be tagged with which roles can see it. If a user has no access to a page, that link simply won't appear.

---

### Feature 2: Route-Level Protection

Even if someone manually types a restricted URL (e.g., a receptionist navigating to `/dashboard/staff`), they'll be redirected to the dashboard home with a "You don't have access" message. This prevents URL-based bypass.

---

### Feature 3: Role-Aware Dashboard Home

The dashboard home page will adapt based on role:
- **Dentist**: sees their own appointments for today, their patients, and clinical stats
- **Receptionist**: sees today's full schedule, quick patient registration, and appointment booking
- **Accountant**: sees financial stats (revenue, pending payments, outstanding invoices)
- **Hygienist/Assistant**: sees today's schedule and patient list
- **Admin**: sees everything (full overview)

Quick action buttons will also change per role (e.g., a receptionist won't see "Create Prescription").

---

### Feature 4: Role Badge in Sidebar

The sidebar footer will display the user's role as a small badge beneath their name (e.g., "Dentist", "Receptionist") so they always know which role they're logged in with.

---

### Feature 5: Seed Data for Testing

To properly test role-based access, we'll seed the database with:
- A treatment catalog (common dental procedures with prices)
- Staff members for each role
- A few sample patients

This ensures every role has data to work with when testing.

