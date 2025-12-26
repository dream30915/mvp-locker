'use client'

import { useCart } from '@/components/cart/CartContext'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'

export default function CartPage() {
    const { items, removeItem, totalAmount } = useCart()

    if (items.length === 0) {
        return (
            <main className="min-h-screen text-white bg-background">
                <Navbar />
                <div className="flex h-[60vh] flex-col items-center justify-center p-4">
                    <h1 className="text-4xl font-black uppercase tracking-tighter">Cart Empty</h1>
                    <Link href="/" className="mt-6 border border-white px-8 py-3 font-bold uppercase hover:bg-white hover:text-black">
                        Go Shopping
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen pb-20 text-white bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-8 text-3xl font-black uppercase tracking-tighter">Your Cart</h1>

                <div className="flex flex-col gap-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between border border-crtz-grey bg-gray-900/50 p-4">
                            <div className="flex gap-4">
                                <div className="h-20 w-20 bg-gray-800 relative">
                                    {/* Image would go here */}
                                </div>
                                <div>
                                    <p className="font-bold uppercase">{item.product.title}</p>
                                    <p className="text-sm text-gray-400">Size: {item.size}</p>
                                    <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <p className="font-bold">THB {(item.product.base_price * item.quantity).toLocaleString()}</p>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-xs text-red-500 underline uppercase"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex flex-col items-end gap-4 border-t border-crtz-grey pt-8">
                    <div className="flex w-full justify-between text-xl font-black uppercase sm:w-1/2">
                        <span>Total</span>
                        <span className="text-crtz-yellow">THB {totalAmount.toLocaleString()}</span>
                    </div>

                    <Link
                        href="/checkout"
                        className="w-full bg-crtz-yellow py-4 text-center text-lg font-black uppercase tracking-widest text-black hover:bg-white sm:w-1/2"
                    >
                        Checkout
                    </Link>
                </div>
            </div>
        </main>
    )
}
