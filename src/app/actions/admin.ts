'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function verifyPaymentAction(orderId: string) {
    const supabase = await createClient()

    // 1. Check if current user is admin
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
        return { success: false, message: 'Unauthorized' }
    }

    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim())
    if (!adminEmails.includes(user.email)) {
        return { success: false, message: 'Not an admin' }
    }

    // 2. Call the RPC function using Admin Client (Service Role)
    const adminClient = createAdminClient()

    const { data, error } = await adminClient.rpc('finalize_order', {
        p_order_id: orderId
    })

    if (error) {
        console.error('Finalize Error:', error)
        return { success: false, message: error.message }
    }

    // Cast response because RPC returns JSONB which TS sees as any/JSON
    const result = data as { success: boolean, message?: string, error?: string }

    if (!result.success) {
        return { success: false, message: result.error || 'Unknown error' }
    }

    revalidatePath('/admin/orders')
    return { success: true, message: 'Payment Confirmed' }
}
