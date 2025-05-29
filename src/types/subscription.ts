export interface PaymentHistory {
    id: string
    period: string
    amount: string
    status: "pago" | "em_falta" | "em_analise"
    submissionDate: string
    receiptUrl?: string
}

export interface CurrentPlan {
    name: string
    monthlyPrice: string
    status: "ativa" | "pendente" | "suspensa"
    validFrom: string
    validTo: string
    features: string[]
}

export interface Plan {
    id: string
    name: string
    price: string
    priceValue: number
    popular?: boolean
    features: string[]
    limits: {
        restaurants: number
        tables: number
        reservations: number
        staff: number
    }
}

export interface UsageMetrics {
    restaurants: { used: number; limit: number }
    tables: { used: number; limit: number }
    reservations: { used: number; limit: number }
    staff: { used: number; limit: number }
}

export interface PaymentForm {
    holderName: string
    paymentReference: string
    paymentDate: string
    amountPaid: string
    notes: string
}

export interface LoadingStates {
    submitPayment: boolean
    upgrade: boolean
    invoice: boolean
    support: boolean
    invite: boolean
    pause: boolean
    backup: boolean
    chat: boolean
}

export interface NotificationSettings {
    email: boolean
    sms: boolean
    whatsapp: boolean
} 