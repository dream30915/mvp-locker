import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { checkIsAdmin } from '@/lib/auth-utils'
import AdminUsersList from '@/components/admin/AdminUsersList'

export default async function AdminUsersPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !(await checkIsAdmin(user))) {
        redirect('/')
    }

    // Fetch all profiles
    // Note: 'profiles' usually contains limited rows due to RLS if not admin.
    // We added a policy "Admins can view all profiles" in the SQL migration.
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    return <AdminUsersList users={profiles || []} />
}
