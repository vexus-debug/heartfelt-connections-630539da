

# Revenue Allocation Rules — Implementation Plan

## Overview
A new Admin-only finance section within the dashboard that automatically splits every recorded payment into predefined allocation categories, tracks excess payments in a "War Chest," and provides a clean summary view of all allocations.

---

## 1. New Database Tables

### `revenue_allocation_rules`
Stores the current allocation percentages (editable by Admin). Only one active rule set at a time.
- Categories: Direct Costs, Base Operations, Volume Bonus Pool, Clinical Savings, Investors, Tithe
- Each with a percentage value
- Validation: percentages must total 100%
- `is_active` toggle (Admin can enable/disable the feature)
- Timestamps for audit trail

### `revenue_allocations`
Stores the calculated split for every payment recorded.
- Links to the `payments` table
- One row per category per payment (e.g., 6 rows per payment)
- Stores: category name, percentage used, calculated amount
- Immutable once created (historical records never change)

### `war_chest_entries`
Tracks excess payments (amount paid above the invoice's service total).
- Links to the `payments` table
- Stores the excess amount
- Running total queryable via SUM

### RLS Policies
- All three tables: read/write restricted to Admin role only
- Uses existing `has_role()` security definer function

---

## 2. Automatic Allocation Logic

### Database Trigger on `payments` table
When a new payment is inserted:
1. Fetch the active allocation rules
2. Calculate each category's share of the payment amount
3. Insert rows into `revenue_allocations`
4. Check if the payment causes the invoice's `amount_paid` to exceed the `total_amount` — if so, calculate the excess and insert into `war_chest_entries`
5. If allocation rules are disabled, skip allocation (payment still records normally)

This ensures:
- Calculations are instant and automatic
- Errors in allocation never block payment recording (wrapped in exception handling)
- Rule changes only affect future payments

---

## 3. Dashboard UI — "Revenue Allocation" Page

### Location
- New sidebar menu item under a "Finance" section, visible only to Admin users
- Single page at `/dashboard/revenue-allocation`

### Summary Cards (Top Row)
- **Total Revenue** (all-time sum of payments)
- **Revenue This Month**
- **War Chest Balance** (running total of excess payments)

### Allocation Rules Card
- Displays current percentages in an editable table
- Edit mode with inline number inputs
- Real-time validation: total must equal 100%
- Save button (disabled if total ≠ 100%)
- Toggle switch to enable/disable the allocation system

### Allocation Breakdown Card
- Table showing each category with:
  - Category name
  - Percentage
  - All-time allocated amount
  - This month's allocated amount
- Clean, professional styling with currency formatting (₦)

### Historical Allocations
- Scrollable table of recent payment allocations
- Columns: Date, Payment Reference, Total Amount, and per-category breakdown
- Read-only view
- Filterable by date range

---

## 4. Access Control
- Sidebar item hidden for non-Admin users (using existing role-based sidebar filtering)
- Route protected via existing `ProtectedRoute` + `roleAccess` config
- Database-level RLS ensures no data leakage even if UI is bypassed

---

## 5. Data Accuracy
- All monetary values pulled live from Supabase (no mock data)
- Allocation calculations happen at the database level via triggers for consistency
- React Query used for real-time data fetching with automatic cache invalidation

