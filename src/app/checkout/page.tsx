'use client'

import { useCart } from '@/components/cart/CartContext'
import { Navbar } from '@/components/layout/Navbar'
import { createCheckoutSession } from '@/app/actions/payment'
import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// Use new React 19 hook if available, else useState legacy wrapper.
// Since we are on Next 15.1, useActionState is likely available or useFormState.
// Let's stick to standard async handler for safety if hooks trigger issues.

export default function CheckoutPage() {
    const { items, totalAmount } = useCart()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError('')

        // Append cart data
        formData.append('cart', JSON.stringify(items))

        // Call Server Action
        // Note: In Next.js client components, we can call imported Server Actions directly.
        const result = await createCheckoutSession(null, formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        } else if (result?.success && result.session) {
            // Redirect
            if (result.session.provider === 'stripe') {
                window.location.href = result.session.checkoutUrl!
            } else {
                router.push(`/checkout/promptpay/${result.session.paymentRef.replace('pp_', '')}`) // Hacky orderId extraction
                // Re-check: paymentRef was `pp_${items[0].orderId}`? 
                // Actually the session object has paymentRef. 
                // Let's adjust action to return orderId explicitly if needed.
                // Or in PromptPay page, we fetch by orderId. 
                // Let's pass orderId in session result.
            }
        }
    }

    // Update: let's modifying existing code is hard, let's fix the logic here.
    // The action returns `session`, which has `paymentRef`.
    // Wait, in `payment-service.ts`, PromptPay ref is `pp_${orderId}`.
    // So replacing `pp_` gives orderId. Logic holds.

    if (items.length === 0) {
        if (typeof window !== 'undefined') router.push('/cart')
        return null
    }

    return (
        <main className="min-h-screen pb-20 text-white bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-8 text-3xl font-black uppercase tracking-tighter">Checkout</h1>

                <form action={handleSubmit} className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                    {/* FORM */}
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="font-bold uppercase text-gray-400">Shipping Address</label>
                            <textarea
                                name="address"
                                required
                                className="h-32 w-full rounded-none border border-crtz-grey bg-gray-900 p-4 text-white focus:border-crtz-yellow focus:outline-none"
                                placeholder="Full address (Street, City, Zip, Phone)"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-bold uppercase text-gray-400">Payment Method</label>
                            <div className="flex gap-4">
                                <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 border border-crtz-grey bg-gray-900 py-4 hover:border-white">
                                    <input type="radio" name="provider" value="stripe" required className="accent-crtz-yellow" />
                                    <span className="font-bold uppercase">Card (Stripe)</span>
                                </label>
                                <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 border border-crtz-grey bg-gray-900 py-4 hover:border-white">
                                    <input type="radio" name="provider" value="promptpay" required className="accent-crtz-yellow" />
                                    <span className="font-bold uppercase">PromptPay</span>
                                </label>
                            </div>
                        </div>

                        {error && (
                            <div className="border border-red-500 bg-red-900/20 p-4 text-red-500 font-bold uppercase">
                                Error: {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 w-full bg-crtz-yellow py-4 text-lg font-black uppercase tracking-widest text-black hover:bg-white disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : `Pay THB ${totalAmount.toLocaleString()}`}
                        </button>
                    </div>

                    {/* SUMMARY */}
                    <div className="bg-gray-900/30 p-6 border border-crtz-grey h-fit">
                        <h3 className="mb-4 text-xl font-bold uppercase">Order Summary</h3>
                        <div className="flex flex-col gap-2 text-sm text-gray-400">
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between">
                                    <span>{item.quantity}x {item.product.title}</span>
                                    <span>THB {(item.product.base_price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 border-t border-gray-700 pt-4 flex justify-between font-bold text-white text-lg">
                            <span>Total</span>
                            <span className="text-crtz-yellow">THB {totalAmount.toLocaleString()}</span>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    )
}
