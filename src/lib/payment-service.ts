import {
    PaymentAdapter,
    CreatePaymentSessionParams,
    PaymentSessionResult,
    VerifyPaymentParams
} from '@/types/payment'

// --- Mock Stripe Adapter (Real one needs stripe-node) ---
class StripeAdapter implements PaymentAdapter {
    async createSession(params: CreatePaymentSessionParams): Promise<PaymentSessionResult> {
        // In real impl: call stripe.checkout.sessions.create
        // For now, return a mock URL

        // Simulate API call
        console.log('[Stripe] Creating session for:', params.orderId)

        return {
            provider: 'stripe',
            paymentRef: `cs_test_${Math.random().toString(36).substring(7)}`,
            checkoutUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/stripe-mock?order_id=${params.orderId}`,
            expiresAt: new Date(Date.now() + 3600 * 1000).toISOString() // 1 hour
        }
    }

    async verifyPayment(params: VerifyPaymentParams): Promise<boolean> {
        // Stripe verification usually happens via Webhook, not manual verify
        // But this method might check session status via API
        console.log('[Stripe] Verifying:', params.orderId)
        return true
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
