

export type RecurringInterval = "daily" | "weekly" | "monthly" | "yearly"
export type Currency = "USD" | "GBP" | "Kz"


export type SubscriptionPlanCreate = {
    name: string,
    price: number,
    currency: Currency,
    interval: RecurringInterval,
    features: string[],
    description: string,
    trialDays: number,
    isActive: boolean
}


export type SubscriptionPlan = {
    _id: string,
    createdAt: Date,
    updatedAt: Date,
} & SubscriptionPlanCreate


type OptionalSubscriptionPlanFields = Partial<Omit<SubscriptionPlan, '_id' | 'createdAt' | 'updatedAt'>>;

export type PartialSubscriptionPlan = OptionalSubscriptionPlanFields & {
    _id: string;
    createdAt: string;
    updatedAt: string;
};