export type PaymentProvider = 'stripe' | 'promptpay'
export type PaymentStatus = 'pending' | 'awaiting_proof' | 'paid' | 'failed' | 'expired' | 'refunded'

export interface CreatePaymentSessionParams {
    orderId: string
    amount: number
    currency?: string // default THB
    description?: string
    metadata?: Record<string, any>
    userId: string
    email: string
}

export interface PaymentSessionResult {
    provider: PaymentProvider
    paymentRef: string // stripe session id or promptpay ref
    checkoutUrl?: string // Stripe URL
    qrPayload?: string // PromptPay QR text
    qrImageUrl?: string // Generated QR image link (optional)
    expiresAt?: string // ISO date
}

export interface VerifyPaymentParams {
    orderId: string
    evidenceUrl?: string // for PromptPay slip
    adminId?: string // who verified it
}

export interface PaymentAdapter {
    createSession(params: CreatePaymentSessionParams): Promise<PaymentSessionResult>
    verifyPayment(params: VerifyPaymentParams): Promise<boolean>
}
