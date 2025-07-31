import { apiClient } from "@/api/axios";
import {
    Subscription,
    UsageMetrics,
    PaymentHistory,
    Plan,
} from "@/types/subscription";
import { Invoice } from "@/types/invoice";

const baseRoute = "/subscriptions";
const paymentsRoute = "/payments";
const plansRoute = "/plans";

export const subscriptionsApi = {
    /* -------------------------------------------------------------------------- */
    /*                                Plans API                                   */
    /* -------------------------------------------------------------------------- */

    paginatePlans: async (params?: { page?: number; limit?: number }) => {
        const response = await apiClient.get<Plan[]>(`${plansRoute}/paginate`, {
            params,
        });
        return response.data;
    },

    createPlan: async (data: Plan) => {
        const response = await apiClient.post<Plan>(`${plansRoute}/`, data);
        return response.data;
    },

    updatePlan: async (planId: string, data: Partial<Plan>) => {
        const response = await apiClient.put<Plan>(`${plansRoute}/plan/${planId}`, data);
        return response.data;
    },

    deletePlan: async (planId: string) => {
        const response = await apiClient.delete<boolean>(`${plansRoute}/plan/${planId}`);
        return response.data;
    },

    getPlan: async (planId: string) => {
        const response = await apiClient.get<Plan>(`${plansRoute}/plan/${planId}`);
        return response.data;
    },

    listActivePlans: async () => {
        const response = await apiClient.get<Plan[]>(`${plansRoute}/`);
        return response.data;
    },

    getPlans: async () => {
        const response = await apiClient.get<Plan[]>(`${plansRoute}/all`);
        return response.data;
    },

    /* -------------------------------------------------------------------------- */
    /*                             Subscriptions API                               */
    /* -------------------------------------------------------------------------- */

    paginateSubscriptions: async (params?: { page?: number; limit?: number }) => {
        const response = await apiClient.get<Subscription[]>(`${baseRoute}/paginate`, {
            params,
        });
        return response.data;
    },

    subscribe: async (payload: { planId: string }) => {
        const response = await apiClient.post<Subscription>(`${baseRoute}/subscribe`, payload);
        return response.data;
    },

    unsubscribe: async (subscriptionId: string) => {
        const response = await apiClient.post<Subscription>(
            `${baseRoute}/unsubscribe/${subscriptionId}`,
        );
        return response.data;
    },

    getCurrentSubscription: async () => {
        const response = await apiClient.get<Subscription>(`${baseRoute}/current`);
        return response.data;
    },

    getUserCurrentSubscription: async (userId: string) => {
        const response = await apiClient.get<Subscription>(`${baseRoute}/users/${userId}/current`);
        return response.data;
    },

    getUsageMetrics: async () => {
        const response = await apiClient.get<UsageMetrics>(`${baseRoute}/usage`);
        return response.data;
    },

    listPaymentHistory: async (params?: { from?: string; to?: string; status?: string }) => {
        const response = await apiClient.get<PaymentHistory[]>(`${paymentsRoute}/history`, { params });
        return response.data;
    },

    changePlan: async (payload: { planId: string; reason?: string }) => {
        const response = await apiClient.post<Subscription>(`${baseRoute}/change-plan`, payload);
        return response.data;
    },

    uploadPaymentProof: async (formData: FormData) => {
        const response = await apiClient.post(`${paymentsRoute}/proofs`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    },

    getLatestInvoice: async () => {
        const response = await apiClient.get<Invoice>(`${paymentsRoute}/latest-invoice`);
        return response.data;
    },

    downloadInvoice: async (invoiceId: string) => {
        const response = await apiClient.get<Blob>(`${paymentsRoute}/invoice/${invoiceId}`, {
            responseType: "blob",
        });
        return response.data;
    },

    pauseSubscription: async (subscriptionId: string, payload?: { reason?: string }) => {
        const response = await apiClient.post<Subscription>(
            `${baseRoute}/${subscriptionId}/pause`,
            payload,
        );
        return response.data;
    },

    resumeSubscription: async (subscriptionId: string) => {
        const response = await apiClient.post<Subscription>(`${baseRoute}/${subscriptionId}/resume`);
        return response.data;
    },

    backupAccountData: async () => {
        const response = await apiClient.get<Blob>(`${baseRoute}/backup`, {
            responseType: "blob",
        });
        return response.data;
    },
};
