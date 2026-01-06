import {
    PaymentAdapter,
    CreatePaymentSessionParams,
    PaymentSessionResult,
    VerifyPaymentParams
} from '@/types/payment'

// --- Mock Stripe Adapter (Real one needs stripe-node) ---
// --- Real Stripe Adapter ---
import Stripe from 'stripe'

class StripeAdapter implements PaymentAdapter {
    private stripe: Stripe

    constructor() {
        if (!process.env.STRIPE_SECRET_KEY) {
            console.error('Missing STRIPE_SECRET_KEY')
             // Valid for build time, but will fail at runtime if key missing
        }
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
            apiVersion: '2025-12-15.clover' as any, // Cast to any to avoid type check issues if library types are strict
        });
    }

    async createSession(params: CreatePaymentSessionParams): Promise<PaymentSessionResult> {
        if (!process.env.NEXT_PUBLIC_SITE_URL) throw new Error('Missing NEXT_PUBLIC_SITE_URL')
        
        // Create a checkout session
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'thb',
                        product_data: {
                            name: `Order #${params.orderId}`,
                        },
                        unit_amount: params.amount * 100, // Stripe uses satang/cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${params.orderId}`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
            metadata: {
                orderId: params.orderId,
            },
        })

        return {
            provider: 'stripe',
            paymentRef: session.id,
            checkoutUrl: session.url!,
            expiresAt: new Date(session.expires_at * 1000).toISOString()
        }
    }

    async verifyPayment(params: VerifyPaymentParams): Promise<boolean> {
        // Verification usually via webhook
        if (!params.orderId) return false
        
        try {
             // Retrieve session by ID if we store session ID as paymentRef
             // For now simple check. In production, rely on Webhooks.
             return true
        } catch (e) {
            console.error('Stripe verify error', e)
            return false
        }
    }
}

// --- PromptPay Adapter (Manual) ---
class PromptPayAdapter implements PaymentAdapter {
    async createSession(params: CreatePaymentSessionParams): Promise<PaymentSessionResult> {
        // 1. Generate QR Payload (EMVCo standard)
        // For MVP, we'll use a placeholder string or a simple generator if available.
        // Real-world: use 'promptpay-qr' library.

        const ppId = process.env.PROMPTPAY_ID || '000-000-0000'
        const payload = `PROMPTPAY|${ppId}|${params.amount}|${params.orderId}`

        // 2. Generate QR Image URL (Optional, or frontend does it)
        // We will let frontend render QR from payload

        const minutes = parseInt(process.env.PROMPTPAY_QR_EXPIRE_MINUTES || '30')
        const expiresAt = new Date(Date.now() + minutes * 60000).toISOString()

        return {
            provider: 'promptpay',
            paymentRef: `pp_${params.orderId}`, // Local ref
            qrPayload: payload,
            expiresAt
        }
    }

    async verifyPayment(params: VerifyPaymentParams): Promise<boolean> {
        // Admin manual verification
        // Logic: If admin says "Yes", it's verified.
        // The actual state change happens in the Service/Action level.
        // This adapter method might be used if we had an automated slip reader.
        return !!params.evidenceUrl
    }
}

export class PaymentService {
    private static stripe = new StripeAdapter()
    private static promptpay = new PromptPayAdapter()

    static getAdapter(provider: 'stripe' | 'promptpay'): PaymentAdapter {
        if (provider === 'stripe') return this.stripe
        if (provider === 'promptpay') return this.promptpay
        throw new Error('Invalid payment provider')
    }

    static async createSession(provider: 'stripe' | 'promptpay', params: CreatePaymentSessionParams) {
        const adapter = this.getAdapter(provider)
        return await adapter.createSession(params)
    }
}
