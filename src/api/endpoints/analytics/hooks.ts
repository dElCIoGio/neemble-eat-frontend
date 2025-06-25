import {
    ActiveSessionsSummaryProps,
    CancelledOrdersSummaryProps,
    InvoicesSummaryProps, LastSevenDaysCount,
    OrdersSummaryProps,
    SalesSummaryProps,
    SessionDurationSummaryProps,
    TopItemsSummaryProps
} from "@/api/endpoints/analytics/types";
import {useCallback} from "react";
import {useQuery} from "@tanstack/react-query";
import {analyticsApi} from "@/api/endpoints/analytics/requests";


export function useGetSalesSummary(params: SalesSummaryProps){

    const queryKey = ["sales-summary", params.restaurantId, params.fromDate, params.toDate];

    const queryFn = useCallback(
        () => analyticsApi.getSalesSummary(params).then(data => data),
        [params.restaurantId, params.fromDate, params.toDate]
    )

    return useQuery({
        queryKey,
        queryFn,
        enabled: params.restaurantId != "notfound",
    })

}


export function useGetInvoiceSummary(params: InvoicesSummaryProps){

    const queryKey = ["invoices-summary", params.restaurantId, params.status, params.fromDate, params.toDate];

    const queryFn = useCallback(
        () => analyticsApi.getInvoicesSummary(params),
        [params.restaurantId, params.status, params.fromDate, params.toDate]
    )

    return useQuery({
        queryKey,
        queryFn

    })

}

export function useGetOrdersSummary(params: OrdersSummaryProps){

    const queryKey = ["orders-summary", params.restaurantId, params.fromDate, params.toDate];

    const queryFn = useCallback(
        () => analyticsApi.getOrdersSummary(params),
        [params.restaurantId, params.fromDate, params.toDate]
    )

    return useQuery({
        queryKey,
        queryFn,
        enabled: params.restaurantId != "notfound",

    })

}


export function useGetTopItemsSummary(params: TopItemsSummaryProps){

    const queryKey = ["top-items-summary", params.restaurantId, params.topN, params.fromDate, params.toDate];

    const queryFn = useCallback(
        () => analyticsApi.getTopItemsSummary(params),
        [params.restaurantId, params.topN, params.fromDate, params.toDate]
    )

    return useQuery({
        queryKey,
        queryFn,
        enabled: params.restaurantId != "notfound",

    })

}


export function useGetCancelledOrdersSummary(params: CancelledOrdersSummaryProps){

    const queryKey = ["cancelled orders summary", params.restaurantId, params.fromDate, params.toDate];

    const queryFn = useCallback(
        () => analyticsApi.getCancelledOrdersSummary(params),
        [params.restaurantId, params.fromDate, params.toDate]
    )

    return useQuery({
        queryKey,
        queryFn,
        enabled: params.restaurantId != "notfound",


    })

}

export function useGetSessionDurationSummary(params: SessionDurationSummaryProps){

    const queryKey = ["session-duration", params.restaurantId];

    const queryFn = useCallback(
        () => analyticsApi.getSessionDurationSummary(params),
        [params.restaurantId]
    )

    return useQuery({
        queryKey,
        queryFn,
        enabled: params.restaurantId != "notfound",

    })

}

export function useGetActiveSessionsSummary(params: ActiveSessionsSummaryProps){

    const queryKey = ["active-sessions-summary", params.restaurantId];

    const queryFn = useCallback(
        () => analyticsApi.getActiveSessionsSummary(params),
        [params.restaurantId]
    )

    return useQuery({
        queryKey,
        queryFn,
        enabled: params.restaurantId != "notfound",

    })

}

export function useGetLastSevenDaysCount (params: LastSevenDaysCount){

    const queryKey = ["last 7 days", params.restaurantId]

    const queryFn = useCallback(
        () => analyticsApi.getLastSevenDaysCount(params),
        [params.restaurantId]
    )

    return useQuery({
        queryKey,
        queryFn,
        enabled: params.restaurantId != "notfound",

    })

}