import { createClient } from '@/utils/supabase/server'

export async function checkIsAdmin(user: any) {
    if (!user || !user.email) return false

    // 1. Check Environment Variable (Super Admins)
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim())
    if (adminEmails.includes(user.email)) return true

    // 2. Check Database (Promoted Admins)
    const supabase = await createClient()
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

    return !!profile?.is_admin
}
