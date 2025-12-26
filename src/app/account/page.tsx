import { createClient } from '@/utils/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AccountPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // Fetch Profile (Tier/Points)
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Fetch Orders
    const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    const tierColor = profile?.tier === 'vip' ? 'text-crtz-yellow' : profile?.tier === 'gold' ? 'text-yellow-500' : 'text-gray-400'

    return (
        <main className="min-h-screen pb-20 text-white bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-12">
                <h1 className="mb-8 text-3xl font-black uppercase tracking-tighter">My Account</h1>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {/* PROFILE CARD */}
                    <div className="h-fit border border-crtz-grey bg-gray-900/50 p-6">
                        <p className="text-gray-400 text-sm uppercase">Email</p>
                        <p className="font-bold mb-6">{user.email}</p>

                        <div className="mb-6">
                            <p className="text-gray-400 text-sm uppercase">Membership Tier</p>
                            <p className={`text-4xl font-black uppercase ${tierColor}`}>{profile?.tier || 'SILVER'}</p>
                        </div>

                        <div>
                            <p className="text-gray-400 text-sm uppercase">Points Balance</p>
                            <p className="text-2xl font-bold uppercase">{profile?.current_points?.toLocaleString() || 0} PTS</p>
                        </div>

                        <form action="/auth/signout" method="post">
                            <button
                                className="mt-8 w-full border border-crtz-red py-2 text-sm font-bold uppercase text-crtz-red hover:bg-crtz-red hover:text-white transition-colors"
                            >
                                Sign Out
                            </button>
                        </form>
                    </div>

                    {/* ORDERS */}
                    <div className="lg:col-span-2">
                        <h2 className="mb-6 text-xl font-bold uppercase">Order History</h2>

                        <div className="flex flex-col gap-4">
                            {orders && orders.length > 0 ? (
                                orders.map((order) => (
                                    <div key={order.id} className="flex flex-col justify-between border border-crtz-grey bg-gray-900/30 p-4 sm:flex-row sm:items-center">
                                        <div>
                                            <p className="font-bold uppercase">Order #{order.id.slice(0, 8)}</p>
                                            <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 mt-4 sm:mt-0">
                                            <p className="font-bold">THB {order.total_amount.toLocaleString()}</p>
                                            <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wide border ${order.status === 'confirmed' ? 'border-green-500 text-green-500' :
                                                order.payment_status === 'awaiting_proof' ? 'border-orange-500 text-orange-500' :
                                                    'border-gray-500 text-gray-500'
                                                }`}>
                                                {order.payment_status === 'paid' ? order.status : order.payment_status}
                                            </span>
                                            {order.payment_status === 'pending' && order.payment_provider === 'promptpay' && (
                                                <Link href={`/checkout/promptpay/${order.id}`} className="text-xs underline text-crtz-yellow">
                                                    Scan to Pay
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No orders yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
