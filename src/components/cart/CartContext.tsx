'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Database } from '@/types/database.types'

type Product = Database['public']['Tables']['products']['Row']

export interface CartItem {
    id: string // variant_id or product_id if no variance
    product: Product
    variantId?: string
    size?: string
    color?: string
    quantity: number
}

interface CartContextType {
    items: CartItem[]
    addItem: (item: Omit<CartItem, 'id'>) => void
    removeItem: (id: string) => void
    clearCart: () => void
    totalAmount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        const saved = localStorage.getItem('mvp_cart')
        if (saved) {
            try {
                setItems(JSON.parse(saved))
            } catch (e) {
                console.error('Failed to parse cart', e)
            }
        }
    }, [])

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('mvp_cart', JSON.stringify(items))
        }
    }, [items, isMounted])

    const addItem = (newItem: Omit<CartItem, 'id'>) => {
        setItems((current) => {
            // Create unique ID based on variant or product + options
            const itemId = newItem.variantId || `${newItem.product.id}-${newItem.size}-${newItem.color}`

            const existing = current.find((i) => i.id === itemId)
            if (existing) {
                return current.map((i) =>
                    i.id === itemId ? { ...i, quantity: i.quantity + newItem.quantity } : i
                )
            }
            return [...current, { ...newItem, id: itemId }]
        })
    }

    const removeItem = (id: string) => {
        setItems((current) => current.filter((i) => i.id !== id))
    }

    const clearCart = () => setItems([])

    const totalAmount = items.reduce(
        (total, item) => total + item.product.base_price * item.quantity,
        0
    )

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, clearCart, totalAmount }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) throw new Error('useCart must be used within CartProvider')
    return context
}
