export type RecurringInterval = "daily" | "weekly" | "monthly" | "yearly"
export type Currency = "USD" | "GBP" | "Kz"

export interface PlanLimits {
    restaurants: number
    tables: number
    reservations: number
    menuItems: number
    staff: number
}

export interface Plan {
    _id: string
    name: string
    price: number
    currency?: Currency
    interval?: RecurringInterval
    description?: string
    popular?: boolean
    features: string[]
    limits: PlanLimits
    createdAt: Date
    updatedAt: Date
}

export interface Subscription {
    _id: string
    userId?: string
    plan: Plan
    startDate: string
    endDate?: string
    status: "ativa" | "pendente" | "suspensa" | "cancelada"
    autoRenew?: boolean
    createdAt: Date
    updatedAt: Date
    pauseReason?: string
}

export interface PaymentHistory {
    _id: string
    subscriptionId: string
    period: string
    amount: string
    status: "pago" | "em_falta" | "em_analise"
    paymentDate: string
    receiptUrl?: string
    createdAt: Date
    updatedAt: Date
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
