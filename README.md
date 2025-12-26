# MVP LOCKER | Streetwear E-commerce + CRM

High-performance, Corteiz-inspired streetwear platform with exclusive "Archive" access, Tiers, Points, and PromptPay/Stripe payments.

## Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS v3, Framer Motion
- **Backend**: Supabase (Postgres, Auth, Storage, Edge Functions)
- **Payments**: Custom Abstraction (PromptPay QR + Stripe)

## Setup Guide

### 1. Environment
Copy `.env.example` to `.env` and fill in your keys.
- **Supabase**: URL + Anon Key + Service Role (for Admin Actions)
- **Admin**: Add your email to `ADMIN_EMAILS` to access the dashboard.

### 2. Database (Supabase)
Run the SQL queries found in `supabase/migrations` in your Supabase SQL Editor:
1. `20251225000000_init_schema.sql` (Tables & RLS)
2. `20251225000001_finalize_order.sql` (RPC Function)
3. `seed.sql` (Sample Products)

*Enable Storage*: Create a public bucket named `slips` for payment proof uploads.

### 3. Install & Run
```bash
npm install
npm run dev
```

## Features

### Membership & Loyalty
- **Tiers**: Silver -> Gold (10k spent) -> VIP (50k spent).
- **Points**: 1 THB = 1 Point. Auto-calculated on `finalize_order`.

### Payments
- **PromptPay**: Generates QR code -> Customer uploads slip -> Admin verifies in Dashboard -> System atomic finalize.
- **Stripe**: Standard Checkout flow (configured but requires keys).

### Admin Dashboard (`/admin`)
- View pending PromptPay slips.
- Verify payments (triggers inventory deduction & point awarding).
- View total revenue and orders.

## Deployment
Deploy to Vercel:
1. Import git repo.
2. Add Environment Variables (Same as .env).
3. Deploy!
