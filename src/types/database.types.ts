export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string | null
                    tier: 'silver' | 'gold' | 'vip'
                    current_points: number
                    lifetime_spend: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    tier?: 'silver' | 'gold' | 'vip'
                    current_points?: number
                    lifetime_spend?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    tier?: 'silver' | 'gold' | 'vip'
                    current_points?: number
                    lifetime_spend?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            products: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    slug: string
                    base_price: number
                    images: string[]
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    slug: string
                    base_price: number
                    images?: string[]
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    slug?: string
                    base_price?: number
                    images?: string[]
                    is_active?: boolean
                    created_at?: string
                }
            }
            product_variants: {
                Row: {
                    id: string
                    product_id: string
                    size: string
                    color: string
                    stock_quantity: number
                    sku: string | null
                }
                Insert: {
                    id?: string
                    product_id: string
                    size: string
                    color: string
                    stock_quantity?: number
                    sku?: string | null
                }
                Update: {
                    id?: string
                    product_id?: string
                    size?: string
                    color?: string
                    stock_quantity?: number
                    sku?: string | null
                }
            }
            orders: {
                Row: {
                    id: string
                    user_id: string | null
                    status: 'open' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
                    total_amount: number
                    shipping_address: Json | null
                    payment_provider: 'stripe' | 'promptpay'
                    payment_status: 'pending' | 'awaiting_proof' | 'paid' | 'failed' | 'expired' | 'refunded'
                    payment_ref: string | null
                    payment_metadata: Json | null
                    paid_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    status?: 'open' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
                    total_amount: number
                    shipping_address?: Json | null
                    payment_provider: 'stripe' | 'promptpay'
                    payment_status?: 'pending' | 'awaiting_proof' | 'paid' | 'failed' | 'expired' | 'refunded'
                    payment_ref?: string | null
                    payment_metadata?: Json | null
                    paid_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    status?: 'open' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
                    total_amount?: number
                    shipping_address?: Json | null
                    payment_provider?: 'stripe' | 'promptpay'
                    payment_status?: 'pending' | 'awaiting_proof' | 'paid' | 'failed' | 'expired' | 'refunded'
                    payment_ref?: string | null
                    payment_metadata?: Json | null
                    paid_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            order_items: {
                Row: {
                    id: string
                    order_id: string
                    product_variant_id: string | null
                    quantity: number
                    price_at_purchase: number
                    product_name_snapshot: string | null
                }
                Insert: {
                    id?: string
                    order_id: string
                    product_variant_id?: string | null
                    quantity?: number
                    price_at_purchase: number
                    product_name_snapshot?: string | null
                }
                Update: {
                    id?: string
                    order_id?: string
                    product_variant_id?: string | null
                    quantity?: number
                    price_at_purchase?: number
                    product_name_snapshot?: string | null
                }
            }
            points_ledger: {
                Row: {
                    id: string
                    user_id: string
                    points_change: number
                    reason: string
                    order_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    points_change: number
                    reason: string
                    order_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    points_change?: number
                    reason?: string
                    order_id?: string | null
                    created_at?: string
                }
            }
        }
    }
}
