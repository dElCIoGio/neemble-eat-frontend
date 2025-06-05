
interface RestaurantDataProps {
    restaurantId: string;
    fromDate?: string;
    toDate?: string;
}

export type SalesSummaryProps = {
} & RestaurantDataProps

export type InvoicesSummaryProps = {
    status: string;
} & RestaurantDataProps

export type OrdersSummaryProps = {} & RestaurantDataProps

export type TopItemsSummaryProps = {
    topN?: number
} & RestaurantDataProps

export type CancelledOrdersSummaryProps = {} & RestaurantDataProps

export type SessionDurationSummaryProps = {
    restaurantId: string;
}

export type ActiveSessionsSummaryProps = {
    restaurantId: string;
}

export type LastSevenDaysCount = {
    restaurantId: string;
}