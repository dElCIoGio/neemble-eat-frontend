import { apiClient } from "@/api/axios";
import { Subscription, UsageMetrics, PaymentHistory, Plan } from "@/types/subscription";
import { Invoice } from "@/types/invoice";

const baseRoute = "/subscriptions";
const paymentsRoute = "/payments";
const plansRoute = "/plans";

export const subscriptionsApi = {
    getCurrentSubscription: async () => {
        const response = await apiClient.get<Subscription>(`${baseRoute}/current`);
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

    getPlans: async () => {
        const response = await apiClient.get<Plan[]>(`${plansRoute}/all`);
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
        const response = await apiClient.get<Invoice>(`${paymentsRoute}/latest`);
        return response.data;
    },

    downloadInvoice: async (invoiceId: string) => {
        const response = await apiClient.get<Blob>(`${paymentsRoute}/${invoiceId}/download`, {
            responseType: "blob",
        });
        return response.data;
    },

    pauseSubscription: async (payload?: { reason?: string }) => {
        const response = await apiClient.post<Subscription>(`${baseRoute}/pause`, payload);
        return response.data;
    },

    resumeSubscription: async () => {
        const response = await apiClient.post<Subscription>(`${baseRoute}/resume`);
        return response.data;
    },

    backupAccountData: async () => {
        const response = await apiClient.post<Blob>(`${baseRoute}/backup`, null, {
            responseType: "blob",
        });
        return response.data;
    },
};
