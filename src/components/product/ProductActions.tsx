'use client'

import { useState } from 'react'
import { Database } from '@/types/database.types'
import { useCart } from '@/components/cart/CartContext'
import clsx from 'clsx'

type Product = Database['public']['Tables']['products']['Row']
type Variant = Database['public']['Tables']['product_variants']['Row']

export function ProductActions({ product, variants }: { product: Product; variants: Variant[] }) {
    const { addItem } = useCart()
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)

    // Group variants by size? Or generally verify uniqueness.
    // Assumption: Each size/color combo is a variant.
    // For UI, we list sizes.

    const handleAddToCart = () => {
        if (!selectedVariantId) return alert('SELECT SIZE')

        const variant = variants.find(v => v.id === selectedVariantId)
        if (!variant) return

        addItem({
            product,
            variantId: variant.id,
            size: variant.size,
            color: variant.color,
            quantity: 1
        })

        alert('ADDED TO CART')
    }

    const isSoldOut = variants.every(v => v.stock_quantity <= 0)

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold uppercase text-gray-400">Size</label>
                <div className="flex flex-wrap gap-2">
                    {variants.map((v) => {
                        const isOutOfStock = v.stock_quantity <= 0
                        const isSelected = selectedVariantId === v.id

                        return (
                            <button
                                key={v.id}
                                disabled={isOutOfStock}
                                onClick={() => setSelectedVariantId(v.id)}
                                className={clsx(
                                    "min-w-[3rem] border px-3 py-2 text-sm font-bold transition-all",
                                    isSelected
                                        ? "border-crtz-yellow bg-crtz-yellow text-black"
                                        : "border-gray-700 bg-black text-white hover:border-white",
                                    isOutOfStock && "cursor-not-allowed opacity-30 decoration-slice line-through"
                                )}
                            >
                                {v.size}
                            </button>
                        )
                    })}
                </div>
            </div>

            <button
                onClick={handleAddToCart}
                disabled={isSoldOut}
                className={clsx(
                    "w-full py-4 text-lg font-black uppercase tracking-widest transition-all",
                    isSoldOut
                        ? "cursor-not-allowed bg-gray-800 text-gray-500"
                        : "bg-crtz-yellow text-black hover:bg-white hover:text-black"
                )}
            >
                {isSoldOut ? 'Sold Out' : 'Add To Cart'}
            </button>

            <p className="text-xs text-gray-500 uppercase tracking-widest text-center mt-2">
                Free Shipping on all orders over 5000 THB
            </p>
        </div>
    )
}
