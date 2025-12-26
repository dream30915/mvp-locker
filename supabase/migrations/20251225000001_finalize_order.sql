-- FUNCTION: finalize_order(order_id)
-- Handles atomic inventory deduction, points awarding, and status update.
create or replace function public.finalize_order(p_order_id uuid) returns jsonb language plpgsql security definer as $$
declare v_order record;
v_item record;
v_user_id uuid;
v_total_amount int;
v_points_to_add int;
v_new_points int;
v_new_lifetime_spend int;
v_current_tier user_tier;
v_new_tier user_tier;
begin -- 1. Lock Order Row to prevent concurrency issues
select * into v_order
from public.orders
where id = p_order_id for
update;
if not found then return jsonb_build_object('success', false, 'error', 'Order not found');
end if;
-- 2. Check Idempotency
if v_order.payment_status = 'paid' then return jsonb_build_object('success', true, 'message', 'Already paid');
end if;
v_user_id := v_order.user_id;
v_total_amount := v_order.total_amount;
-- Points Rule: 1 THB = 1 Point (Simple)
v_points_to_add := v_total_amount;
-- 3. Loop items and deduct inventory
for v_item in
select *
from public.order_items
where order_id = p_order_id loop -- Check stock
    perform 1
from public.product_variants
where id = v_item.product_variant_id
    and stock_quantity >= v_item.quantity;
if not found then raise exception 'Insufficient stock for variant %',
v_item.product_variant_id;
end if;
-- Deduct
update public.product_variants
set stock_quantity = stock_quantity - v_item.quantity
where id = v_item.product_variant_id;
end loop;
-- 4. Mark Order as Paid
update public.orders
set payment_status = 'paid',
    status = 'confirmed',
    paid_at = now()
where id = p_order_id;
-- 5. Update User Points & Tier (if user exists)
if v_user_id is not null then -- Add to Ledger
insert into public.points_ledger (user_id, points_change, reason, order_id)
values (
        v_user_id,
        v_points_to_add,
        'Order Payment',
        p_order_id
    );
-- Update Profile (Points + Lifetime Spend)
update public.profiles
set current_points = current_points + v_points_to_add,
    lifetime_spend = lifetime_spend + v_total_amount
where id = v_user_id
returning current_points,
    lifetime_spend,
    tier into v_new_points,
    v_new_lifetime_spend,
    v_current_tier;
-- Calculate New Tier (Simple Logic)
-- Silver: 0, Gold: 10000, VIP: 50000
v_new_tier := v_current_tier;
if v_new_lifetime_spend >= 50000 then v_new_tier := 'vip';
elsif v_new_lifetime_spend >= 10000 then v_new_tier := 'gold';
end if;
if v_new_tier is distinct
from v_current_tier then
update public.profiles
set tier = v_new_tier
where id = v_user_id;
end if;
end if;
return jsonb_build_object('success', true, 'new_tier', v_new_tier);
exception
when others then return jsonb_build_object('success', false, 'error', SQLERRM);
end;
$$;
-- ERROR SECURITY: Revoke from public, allow only service_role (and postgres)
REVOKE EXECUTE ON FUNCTION public.finalize_order
FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.finalize_order TO service_role;