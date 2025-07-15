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

export type RecurringInterval = "daily" | "weekly" | "monthly" | "yearly"
export type Currency = "USD" | "GBP" | "Kz"

export interface PlanLimits {
    restaurants: number
    tables: number
    reservations: number
    staff: number
}

export interface Plan {
    id: string
    name: string
    price: string
    priceValue: number
    popular?: boolean
    features: string[]
    limits: PlanLimits
}

export interface SubscriptionPlanCreate {
    name: string
    price: number
    currency: Currency
    interval: RecurringInterval
    features: string[]
    description: string
    trialDays: number
    isActive: boolean
    limits: PlanLimits
    popular?: boolean
}

export interface SubscriptionPlan extends SubscriptionPlanCreate {
    _id: string
    createdAt: Date
    updatedAt: Date
}

export type PartialSubscriptionPlan =
    Partial<Omit<SubscriptionPlan, "_id" | "createdAt" | "updatedAt">> & {
        _id: string
        createdAt: string
        updatedAt: string
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
