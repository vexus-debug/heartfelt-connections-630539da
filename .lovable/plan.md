

# 🦷 Dashboard Completion Plan — Missing Features Audit

After reviewing all 13 dashboard pages, the **shell and list views are solid**, but the dashboard is missing critical interactive features that a real clinic management system needs. Here's what needs to be added:

---

## 1. Patient Profile Page (High Priority)
The "View Profile" dropdown exists but leads nowhere. We need a full **Patient Profile page** (`/dashboard/patients/:id`) with tabbed sections:
- **Overview tab**: Personal info, contact, emergency contact, photo placeholder
- **Dental History tab**: Visit timeline showing past procedures
- **Treatment Plans tab**: Active/completed plans with progress bars
- **Dental Chart tab**: Patient-specific interactive tooth chart
- **Billing tab**: Payment history, outstanding balance, linked invoices
- **Prescriptions tab**: Patient's prescription history

---

## 2. Patient Registration Form (High Priority)
The "Add Patient" button currently does nothing. Build a form/dialog with:
- Personal details (name, phone, email, gender, DOB, address)
- Emergency contact info
- Medical history notes field
- Referral source
- Form validation

---

## 3. Appointment Booking Form (High Priority)
The "Book Appointment" button needs a proper booking form/dialog:
- Patient search/select (existing patients)
- Dentist selection with specialty shown
- Chair/room selection
- Date picker + time slot selector
- Treatment type dropdown
- Walk-in toggle
- Notes field

---

## 4. Invoice Creation Form (Medium Priority)
The "Create Invoice" button needs a form:
- Patient selection
- Add treatment line items (from treatment catalog) with quantities
- Subtotal/discount/total calculation
- Payment method (Cash, Transfer, POS, Card)
- Partial payment support
- Invoice preview section (printable layout)

---

## 5. New Prescription Form (Medium Priority)
Build a prescription creation dialog:
- Patient selection
- Add medications (name, dosage, frequency, duration)
- Template quick-select for common prescriptions
- Dentist auto-filled
- Print-friendly preview

---

## 6. New Lab Order Form (Medium Priority)
Build a lab order creation dialog:
- Patient & treatment link
- Lab work type (crown, bridge, denture, veneer, etc.)
- External lab selection
- Due date
- Special instructions/notes

---

## 7. Functional Appointment Calendar Navigation (Medium Priority)
The date navigation arrows in the schedule view don't work. Add:
- Working previous/next day navigation
- A date picker to jump to any date
- Mock data for multiple days
- Week view option

---

## 8. Dental Chart Enhancements (Medium Priority)
The chart is interactive but limited:
- Add patient selector dropdown so it's not hardcoded to one patient
- "Add Procedure" button should open a modal (select status, procedure type, date, notes)
- History log per tooth showing procedure timeline

---

## 9. Invoice/Receipt Detail View (Low Priority)
Clicking an invoice should show:
- Full invoice breakdown with line items
- Payment history (partial payments)
- Printable receipt/invoice layout
- Record payment action button

---

## 10. Staff Schedule & Management (Low Priority)
Currently only shows staff cards. Add:
- Weekly shift schedule grid view
- Edit staff profile capability
- Add new staff member form

---

## 11. Inventory Actions (Low Priority)
Add interactive inventory management:
- "Add Item" button with form
- "Restock" action on low-stock items
- Usage log view

---

## 12. Working Global Search (Low Priority)
The header search bar is currently just a visual placeholder. Add:
- Search results dropdown as you type
- Search across patients (by name/ID/phone), appointments, invoices
- Click result to navigate to the relevant page

---

## Implementation Approach
- All forms will use **dialogs/modals** for quick actions (not separate pages) to keep the workflow smooth
- All data remains **mock data** — designed to be backend-ready for Supabase later
- Forms will include proper validation using react-hook-form + zod
- Priority order: Patient Profile → Registration → Booking → Invoice → Prescription → Lab Order → Calendar → remaining items

