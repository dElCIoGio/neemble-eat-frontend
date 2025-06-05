import {
    ActiveSessionsSummaryProps,
    CancelledOrdersSummaryProps,
    InvoicesSummaryProps, LastSevenDaysCount,
    OrdersSummaryProps,
    SalesSummaryProps,
    SessionDurationSummaryProps,
    TopItemsSummaryProps
} from "@/api/endpoints/analytics/types";
import {useQuery} from "@tanstack/react-query";
import {analyticsApi} from "@/api/endpoints/analytics/requests";


export function useGetSalesSummary(params: SalesSummaryProps){

    const queryKey = ["sales-summary", params.restaurantId];

    return useQuery({
        queryKey,
        queryFn: () => analyticsApi.getSalesSummary(params)
            .then(data => data)
    })

}


export function useGetInvoiceSummary(params: InvoicesSummaryProps){

    const queryKey = ["invoices-summary", params.restaurantId];

    return useQuery({
        queryKey,
        queryFn: () => analyticsApi.getInvoicesSummary(params)

    })

}

export function useGetOrdersSummary(params: OrdersSummaryProps){

    const queryKey = ["orders-summary", params.restaurantId];

    return useQuery({
        queryKey,
        queryFn: () => analyticsApi.getOrdersSummary(params)
    })

}


export function useGetTopItemsSummary(params: TopItemsSummaryProps){

    const queryKey = ["top-items-summary", params.restaurantId];

    return useQuery({
        queryKey,
        queryFn: () => analyticsApi.getTopItemsSummary(params)
    })

}


export function useGetCancelledOrdersSummary(params: CancelledOrdersSummaryProps){

    const queryKey = ["cancelled orders summary", params.restaurantId];

    return useQuery({
        queryKey,
        queryFn: () => analyticsApi.getCancelledOrdersSummary(params)

    })

}

export function useGetSessionDurationSummary(params: SessionDurationSummaryProps){

    const queryKey = ["session-duration", params.restaurantId];

    return useQuery({
        queryKey,
        queryFn: () => analyticsApi.getSessionDurationSummary(params)
    })

}

export function useGetActiveSessionsSummary(params: ActiveSessionsSummaryProps){

    const queryKey = ["active-sessions-summary", params.restaurantId];

    return useQuery({
        queryKey,
        queryFn: () => analyticsApi.getActiveSessionsSummary(params)
    })

}

export function useGetLastSevenDaysCount (params: LastSevenDaysCount){

    const queryKey = ["last 7 days", params.restaurantId]

    return useQuery({
        queryKey,
        queryFn: () => analyticsApi.getLastSevenDaysCount(params)
    })

}