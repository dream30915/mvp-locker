'use client'

import { createClient } from '@/utils/supabase/client'
import { Navbar } from '@/components/layout/Navbar'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'

export default function PromptPayPage() {
    const { orderId } = useParams()
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        async function fetchOrder() {
            const { data } = await supabase.from('orders').select('*').eq('id', orderId).single()
            if (data) setOrder(data)
            setLoading(false)
        }
        fetchOrder()
    }, [orderId, supabase])

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return
        setUploading(true)

        const file = e.target.files[0]
        const ext = file.name.split('.').pop()
        const fileName = `${orderId}_${Date.now()}.${ext}`

        // 1. Upload to Supabase Storage (Bucket: 'slips')
        const { data, error } = await supabase.storage
            .from('slips')
            .upload(fileName, file)

        if (error) {
            alert('Upload failed: ' + error.message)
            setUploading(false)
            return
        }

        // 2. Update Order
        const { error: updateError } = await supabase.from('orders').update({
            payment_status: 'awaiting_proof',
            payment_metadata: {
                ...order.payment_metadata,
                evidence_path: data.path
            }
        }).eq('id', orderId)

        if (updateError) {
            alert('Update failed')
        } else {
            alert('Slip received! Admin will verify shortly.')
            router.push('/account')
        }
        setUploading(false)
    }

    if (loading) return <div className="min-h-screen bg-black text-white p-20">Loading...</div>

    if (!order) return <div className="min-h-screen bg-black text-white p-20">Order Not Found</div>

    const qrPayload = order.payment_metadata?.qrPayload || 'ErrorNoPayload'
    // Use public QR API for MVP
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrPayload)}`

    return (
        <main className="min-h-screen pb-20 text-white bg-background">
            <Navbar />
            <div className="container mx-auto flex flex-col items-center gap-8 px-4 py-12">
                <h1 className="text-3xl font-black uppercase tracking-tighter text-crtz-yellow">Scan to Pay</h1>

                <div className="bg-white p-4">
                    <Image src={qrUrl} alt="PromptPay QR" width={300} height={300} unoptimized />
                </div>

                <div className="text-center">
                    <p className="text-2xl font-bold">THB {order.total_amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">Order ID: {order.id.slice(0, 8)}</p>
                </div>

                <div className="w-full max-w-md border border-crtz-grey bg-gray-900 p-6">
                    <h3 className="mb-4 text-center font-bold uppercase">Upload Payment Slip</h3>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                        className="w-full text-sm text-gray-400 file:mr-4 file:border-0 file:bg-crtz-yellow file:px-4 file:py-2 file:text-sm file:font-bold file:uppercase file:text-black hover:file:bg-white"
                    />
                    {uploading && <p className="mt-2 text-center text-xs uppercase animate-pulse">Uploading...</p>}
                </div>
            </div>
        </main>
    )
}
