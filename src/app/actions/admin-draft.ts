'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function verifyPaymentAction(orderId: string) {
    const supabase = await createClient()

    // 1. Check if current user is admin
    // In a real app, you'd check a role claim or a specific table.
    // Here we check against the env vars list.
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
        return { success: false, message: 'Unauthorized' }
    }

    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim())
    if (!adminEmails.includes(user.email)) {
        return { success: false, message: 'Not an admin' }
    }

    // 2. Call the RPC function securely
    // We need to use the SERVICE_ROLE key to bypass RLS/Permissions if the user isn't granted explicit rights,
    // BUT we granted `service_role` rights to the function.
    // Standard `createClient` uses the user's JWT. 
    // If we Revoked Public, we must use `supabase-admin` (service role).

    // We'll trust the migration we just wrote: "GRANT EXECUTE ... TO service_role"
    // So we need a service role client here.

    // NOTE: We cannot easily use Service Role in Server Actions without exposing it or initializing it separately.
    // Best practice: Use a separate `createAdminClient` utility.

    return { success: false, message: 'Need to implement Admin Client' }
}
