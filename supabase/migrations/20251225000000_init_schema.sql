-- Enable UUID extension
create extension if not exists "uuid-ossp";
-- ----------------------------
-- 1. ENUMS & TYPES
-- ----------------------------
create type user_tier as enum ('silver', 'gold', 'vip');
create type payment_provider as enum ('stripe', 'promptpay');
create type payment_status as enum (
    'pending',
    'awaiting_proof',
    'paid',
    'failed',
    'expired',
    'refunded'
);
create type order_status as enum (
    'open',
    'confirmed',
    'shipped',
    'delivered',
    'cancelled'
);
-- ----------------------------
-- 2. PUBLIC TABLES
-- ----------------------------
-- PROFILES (Public info for users, linked to Auth)
create table public.profiles (
    id uuid references auth.users on delete cascade not null primary key,
    email text,
    tier user_tier default 'silver'::user_tier not null,
    current_points int default 0 not null,
    lifetime_spend int default 0 not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);
-- PRODUCTS
create table public.products (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text,
    slug text unique not null,
    base_price int not null,
    -- stored in THB/smallest unit if needed, usually THB integer
    images text [] default array []::text [],
    is_active boolean default true not null,
    created_at timestamptz default now() not null
);
-- PRODUCT VARIANTS (Size/Color Inventory)
create table public.product_variants (
    id uuid default uuid_generate_v4() primary key,
    product_id uuid references public.products(id) on delete cascade not null,
    size text not null,
    color text not null,
    stock_quantity int default 0 not null,
    sku text,
    unique (product_id, size, color)
);
-- ORDERS
create table public.orders (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete
    set null,
        -- nullable for guest checkout if needed, but we prefer auth
        status order_status default 'open'::order_status not null,
        total_amount int not null,
        shipping_address jsonb,
        -- Payment Info
        payment_provider payment_provider not null,
        payment_status payment_status default 'pending'::payment_status not null,
        payment_ref text,
        -- e.g. stripe session id or promptpay reference
        payment_metadata jsonb default '{}'::jsonb,
        paid_at timestamptz,
        created_at timestamptz default now() not null,
        updated_at timestamptz default now() not null
);
-- ORDER ITEMS
create table public.order_items (
    id uuid default uuid_generate_v4() primary key,
    order_id uuid references public.orders(id) on delete cascade not null,
    product_variant_id uuid references public.product_variants(id),
    quantity int default 1 not null,
    price_at_purchase int not null,
    -- snapshot of price
    product_name_snapshot text -- snapshot of name
);
-- POINTS LEDGER (Append only)
create table public.points_ledger (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    points_change int not null,
    -- positive or negative
    reason text not null,
    -- e.g. "Order #123", "Redemption"
    order_id uuid references public.orders(id),
    -- optional link
    created_at timestamptz default now() not null
);
-- ----------------------------
-- 3. RLS POLICIES
-- ----------------------------
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.points_ledger enable row level security;
-- PROFILES
create policy "Users can view own profile" on public.profiles for
select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for
update using (auth.uid() = id);
-- PRODUCTS & VARIANTS (Public Read, Admin Write)
create policy "Public read products" on public.products for
select using (true);
create policy "Public read variants" on public.product_variants for
select using (true);
-- ORDERS
create policy "Users can view own orders" on public.orders for
select using (auth.uid() = user_id);
create policy "Users can create orders" on public.orders for
insert with check (auth.uid() = user_id);
-- ORDER ITEMS
create policy "Users can view own order items" on public.order_items for
select using (
        exists (
            select 1
            from public.orders
            where orders.id = order_items.order_id
                and orders.user_id = auth.uid()
        )
    );
-- POINTS
create policy "Users can view own points" on public.points_ledger for
select using (auth.uid() = user_id);
-- ----------------------------
-- 4. TRIGGERS (Auto-update updated_at)
-- ----------------------------
create or replace function update_updated_at_column() returns trigger as $$ begin new.updated_at = now();
return new;
end;
$$ language 'plpgsql';
create trigger update_profiles_modtime before
update on public.profiles for each row execute procedure update_updated_at_column();
create trigger update_orders_modtime before
update on public.orders for each row execute procedure update_updated_at_column();
-- ----------------------------
-- 5. PROFILE CREATION TRIGGER
-- ----------------------------
create or replace function public.handle_new_user() returns trigger as $$ begin
insert into public.profiles (id, email)
values (new.id, new.email);
return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
after
insert on auth.users for each row execute procedure public.handle_new_user();