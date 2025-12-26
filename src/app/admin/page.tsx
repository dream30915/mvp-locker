import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // check admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim())
    if (!adminEmails.includes(user.email!)) {
        return <div className="p-20 text-center text-white bg-black min-h-screen">NO ACCESS</div>
    }

    // Fetch Metrics
    const { count: pendingCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('payment_status', 'awaiting_proof')

    const { data: orders } = await supabase.from('orders').select('*')

    const totalRevenue = orders?.reduce((acc, order) => {
        return order.payment_status === 'paid' ? acc + order.total_amount : acc
    }, 0) || 0

    return (
        <main className="min-h-screen pb-20 text-white bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-12">
                <h1 className="mb-8 text-3xl font-black uppercase tracking-tighter">Admin Dashboard</h1>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Link href="/admin/orders" className="block p-6 border border-crtz-yellow bg-crtz-yellow text-black hover:opacity-90">
                        <p className="text-sm font-bold uppercase">Pending Verification</p>
                        <p className="text-5xl font-black">{pendingCount}</p>
                        <p className="mt-2 text-xs font-bold underline">VIEW ORDERS</p>
                    </Link>

                    <div className="p-6 border border-crtz-grey bg-gray-900">
                        <p className="text-sm font-bold uppercase text-gray-400">Total Revenue</p>
                        <p className="text-4xl font-black">THB {totalRevenue.toLocaleString()}</p>
                    </div>

                    <div className="p-6 border border-crtz-grey bg-gray-900">
                        <p className="text-sm font-bold uppercase text-gray-400">Total Orders</p>
                        <p className="text-4xl font-black">{orders?.length}</p>
                    </div>
                </div>
            </div>
        </main>
    )
}
