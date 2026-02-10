

## Phase 3: Billing, Invoices & Inventory

This phase connects the Billing and Inventory pages to real Supabase data, replacing all hardcoded mock data with persistent database-backed functionality.

---

### 1. Disable Email Confirmation for Login
- Update Supabase Auth settings to allow login without email confirmation, so you can sign in with your email immediately

### 2. Create Database Tables

**Invoices Table**
- Links to a patient, with fields for invoice date, status (paid/pending/partial), discount percentage, payment method, total amount, and amount paid
- Auto-generates a human-readable invoice number (e.g., INV-2026-001)

**Invoice Items Table**
- Each invoice can have multiple line items
- Each item links to a treatment, with quantity, unit price, and line total

**Payments Table**
- Tracks individual payments against an invoice over time (supports partial payments)
- Fields: amount, payment method, date, and optional reference number

**Inventory Table**
- Tracks clinic supplies: name, category, current quantity, minimum stock threshold, unit, supplier name, and last restocked date

### 3. Security (Row-Level Security)
- All tables will have RLS enabled
- All authenticated staff can read invoices, invoice items, payments, and inventory
- Admin, dentist, receptionist, and accountant roles can create/update invoices and record payments
- Only admins can delete invoices
- Admin and accountant roles can manage inventory (add items, update stock)

### 4. Connect Billing Page to Database
- **Create Invoice dialog** → inserts into invoices + invoice_items tables, with patient and treatment dropdowns pulling from real Supabase data
- **Billing page stats** (Collected Today, Outstanding Balance, Overdue Invoices) → live queries from invoices table
- **Recent Invoices list** → queries invoices joined with patient names, sorted by date
- **Invoice Detail dialog** → shows real line items and payment history from the database
- **Record Payment** → inserts into payments table and updates invoice paid amount/status

### 5. Connect Inventory Page to Database
- **Inventory list** → queries from inventory table instead of mock data
- **Low Stock Alert** → computed from real stock levels vs. minimum thresholds
- **Add ability to update stock** → admin/accountant can adjust quantities and add new inventory items

### 6. Create Reusable Data Hooks
- `useInvoices()` — fetch invoices with patient info, create new invoices with line items
- `usePayments()` — fetch payment history for an invoice, record new payments
- `useInventory()` — fetch inventory items, update stock levels, add new items

### What You'll Be Able to Do After This Phase
- Create real invoices linked to patients and treatments that persist in the database
- View invoice details with actual line items and totals
- Record partial or full payments against invoices with payment history tracking
- See live billing stats (today's collections, outstanding balances, overdue count)
- Track clinic inventory with real stock levels and low-stock alerts
- Update inventory quantities as supplies are used or restocked

