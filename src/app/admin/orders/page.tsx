import { createClient } from '@/utils/supabase/server'
import { verifyPaymentAction } from '@/app/actions/admin'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function AdminOrdersPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: orders } = await supabase
        .from('orders')
        .select('*, profiles(email)')
        .order('created_at', { ascending: false })

    return (
        <main className="min-h-screen pb-20 text-white bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Orders Manager</h1>
                    <Link href="/admin" className="text-sm underline text-gray-400">Back onto Dash</Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse border border-crtz-grey">
                        <thead className="bg-crtz-grey text-gray-400 font-bold uppercase text-xs">
                            <tr>
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Payment</th>
                                <th className="p-4">Proof</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {orders?.map(order => (
                                <tr key={order.id} className="hover:bg-gray-900/50">
                                    <td className="p-4 font-mono text-xs text-gray-300">{order.id}</td>
                                    <td className="p-4 text-sm">{order.profiles?.email || order.user_id}</td>
                                    <td className="p-4 font-bold">THB {order.total_amount.toLocaleString()}</td>
                                    <td className="p-4 text-sm uppercase">{order.status}</td>
                                    <td className="p-4 text-xs font-mono">
                                        <span className={`block ${order.payment_status === 'paid' ? 'text-green-500' : 'text-orange-500'}`}>
                                            {order.payment_status}
                                        </span>
                                        <span className="text-gray-500">{order.payment_provider}</span>
                                    </td>
                                    <td className="p-4">
                                        {order.payment_metadata?.evidence_path ? (
                                            <a
                                                href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/slips/${order.payment_metadata.evidence_path}`}
                                                target="_blank"
                                                className="text-xs underline text-crtz-yellow"
                                            >
                                                View Slip
                                            </a>
                                        ) : '-'}
                                    </td>
                                    <td className="p-4">
                                        {order.payment_status === 'awaiting_proof' && (
                                            <form action={async () => {
                                                'use server'
                                                await verifyPaymentAction(order.id)
                                            }}>
                                                <button className="bg-green-600 px-3 py-1 text-xs font-bold uppercase hover:bg-green-500">
                                                    Verify
                                                </button>
                                            </form>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    )
}
