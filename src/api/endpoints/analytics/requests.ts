import {apiClient} from "@/api/axios";
import {
    ActiveSessionsSummaryProps,
    CancelledOrdersSummaryProps,
    InvoicesSummaryProps, LastSevenDaysCount,
    OrdersSummaryProps,
    SalesSummaryProps, SessionDurationSummaryProps,
    TopItemsSummaryProps
} from "@/api/endpoints/analytics/types";
import {
    ActiveSessionCount,
    AverageSessionDuration,
    CancelledCount,
    InvoiceCount,
    ItemOrderQuantity,
    OrderCount,
    SalesSummary, TotalOrdersCount
} from "@/types/analytics";


const baseRoute = "/analytics";

export const analyticsApi = {

    getSalesSummary: async (params: SalesSummaryProps) => {

        console.log(params)

        const response = await apiClient.get<SalesSummary>(`${baseRoute}/sales-summary`, {params});
        return response.data
    },

    getInvoicesSummary: async (params: InvoicesSummaryProps) => {
        const response = await apiClient.get<InvoiceCount>(`${baseRoute}/invoices`, {params});
        return response.data
    },

    getOrdersSummary: async (params: OrdersSummaryProps) => {
        const response = await apiClient.get<OrderCount>(`${baseRoute}/orders`, {params});
        return response.data
    },
    getTopItemsSummary: async (params: TopItemsSummaryProps) => {
        const response = await apiClient.get<ItemOrderQuantity[]>(`${baseRoute}/top-items`, {params});
        return response.data
    },
    getCancelledOrdersSummary: async (params: CancelledOrdersSummaryProps) => {
        const response = await apiClient.get<CancelledCount>(`${baseRoute}/cancelled-orders`, {params});
        return response.data
    },
    getSessionDurationSummary: async (params: SessionDurationSummaryProps) => {
        const response = await apiClient.get<AverageSessionDuration>(`${baseRoute}/session-duration`, {params});
        return response.data
    },
    getActiveSessionsSummary: async (params: ActiveSessionsSummaryProps) => {
        const response = await apiClient.get<ActiveSessionCount>(`${baseRoute}/active-sessions`, {params});
        return response.data
    },

    getLastSevenDaysCount: async (params: LastSevenDaysCount) => {
        const response = await apiClient.get<TotalOrdersCount[]>(`${baseRoute}/recent-orders`, {params})
        return response.data
    }


}