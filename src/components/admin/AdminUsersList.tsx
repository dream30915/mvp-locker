'use client'

import { Navbar } from '@/components/layout/Navbar'
import { useState } from 'react'
import { toggleAdminStatus } from '@/app/actions/admin-users'

export default function AdminUsersPage({ users }: { users: any[] }) {
    const [isLoading, setIsLoading] = useState<string | null>(null)

    const handleToggle = async (userId: string, currentStatus: boolean) => {
        if (!confirm(`Are you sure you want to ${currentStatus ? 'REMOVE' : 'GRANT'} admin rights?`)) return

        setIsLoading(userId)
        await toggleAdminStatus(userId, currentStatus)
        setIsLoading(null)
        // In a real app, we might want to optimistically update or router.refresh() here, 
        // but server action revalidatePath should handle it if this was a server component.
        // Since this is a client component receiving props, we need to refresh.
        window.location.reload() 
    }

    return (
        <main className="min-h-screen pb-20 text-white bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-12">
                <h1 className="mb-8 text-3xl font-black uppercase tracking-tighter">Manage Users</h1>

                <div className="overflow-x-auto border border-crtz-grey bg-gray-900/50">
                    <table className="w-full text-left">
                        <thead className="bg-black text-xs uppercase text-gray-400">
                            <tr>
                                <th className="p-4">Email</th>
                                <th className="p-4">Tier</th>
                                <th className="p-4">Spent</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-white/5">
                                    <td className="p-4">{u.email}</td>
                                    <td className="p-4 uppercase">{u.tier}</td>
                                    <td className="p-4">THB {u.lifetime_spend.toLocaleString()}</td>
                                    <td className="p-4">
                                        {u.is_admin ? (
                                            <span className="bg-crtz-red px-2 py-1 text-[10px] font-bold text-white uppercase">Admin</span>
                                        ) : (
                                            <span className="text-gray-500 text-xs uppercase">User</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <button 
                                            onClick={() => handleToggle(u.id, u.is_admin)}
                                            disabled={isLoading === u.id}
                                            className={`px-3 py-1 text-xs font-bold uppercase border ${
                                                u.is_admin 
                                                ? 'border-white text-white hover:bg-white hover:text-black' 
                                                : 'border-crtz-yellow text-crtz-yellow hover:bg-crtz-yellow hover:text-black'
                                            }`}
                                        >
                                            {isLoading === u.id ? '...' : u.is_admin ? 'Demote' : 'Promote'}
                                        </button>
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
