'use server'

import { createClient } from '@/utils/supabase/server'
import { checkIsAdmin } from '@/lib/auth-utils'
import { revalidatePath } from 'next/cache'

export async function toggleAdminStatus(targetUserId: string, currentStatus: boolean) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Security Check
    if (!await checkIsAdmin(user)) {
        return { error: 'Unauthorized' }
    }

    // Prevent removing yourself if you are not a Super Admin (Env)
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim())
    if (user?.email && adminEmails.includes(user.email) && targetUserId === user.id) {
         // Allow if needed, but usually safe to prevent accidental lockout from DB side, 
         // though Env admin is always safe.
    }

    // Update DB
    const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentStatus })
        .eq('id', targetUserId)

    if (error) return { error: error.message }

    revalidatePath('/admin/users')
    return { success: true }
}
