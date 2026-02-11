

## Vista Dental Clinic — Messaging, Notifications & Security Upgrade

### 1. Remove Public Signup Access
- Remove the "Don't have an account?" / Sign Up link from the Login page
- Remove the `/signup` route entirely — only admins will create staff accounts from the Staff management page
- This ensures no outsiders can self-register into the clinic system

### 2. Accurate Dashboard Notification Count + Sound
- Display the real unread notification count (from the `notifications` table) as a badge on the sidebar bell icon and in the dashboard header
- Play a subtle notification sound when a new notification arrives in real-time using Supabase Realtime subscriptions on the `notifications` table
- The sound will only play for genuinely new notifications (not on initial page load)

### 3. Inter-Role Chat Messaging System

**Database: New tables**
- `messages` — stores each message (sender, content, timestamp, optional record references)
- `message_recipients` — links a message to recipient users (supports 1-to-1 and role-broadcast), tracks read status
- `message_attachments` — stores references to existing records (patient, invoice, treatment, lab case) attached to a message

**Role-Based Send Permissions (enforced via RLS)**
- Admin → can message all roles
- Dentist → can message Admin & Receptionist
- Receptionist → can message Admin, Dentist & Accountant
- Accountant → can message Admin only

**Chat UI (new dashboard page: `/dashboard/messages`)**
- Chat-style interface with a conversation list on the left and message thread on the right
- "New Message" button with a dropdown to select a specific user or broadcast to a role
- Messages show sender name, role badge, timestamp, and read status
- Ability to attach references to existing records (patients, invoices, treatments, lab reports) via a searchable picker
- Unread message count badge in the sidebar, with the same notification sound as other notifications
- Real-time message delivery using Supabase Realtime

**Data Sharing Shortcuts**
- From patient profile: "Share with Dentist" quick action sends patient info as a message
- From treatment notes: "Share with Receptionist" for follow-up
- From billing page: share invoice/billing info with relevant roles

**Audit Trail**
- All messages and attachments are stored with timestamps and sender info in the database
- Messages cannot be deleted (append-only), providing a complete audit trail

### 4. Sidebar & Navigation Updates
- Add "Messages" item to the dashboard sidebar with unread count badge
- Update role access config to allow all clinic roles to access the messages page

