import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionsApi } from "./requests";
import { showSuccessToast, showErrorToast } from "@/utils/notifications/toast";

export function useGetCurrentSubscription() {
    return useQuery({
        queryKey: ["subscription", "current"],
        queryFn: subscriptionsApi.getCurrentSubscription,
    });
}

export function useGetUsageMetrics() {
    return useQuery({
        queryKey: ["subscription", "usage"],
        queryFn: subscriptionsApi.getUsageMetrics,
    });
}

export function useGetPaymentHistory(params?: { from?: string; to?: string; status?: string }) {
    const { from = "", to = "", status = "" } = params || {};
    return useQuery({
        queryKey: ["subscription", "history", from, to, status],
        queryFn: () => subscriptionsApi.listPaymentHistory(params),
    });
}

export function useGetPlans() {
    return useQuery({
        queryKey: ["plans", "all"],
        queryFn: subscriptionsApi.getPlans,
    });
}

export function useChangePlan() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: subscriptionsApi.changePlan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subscription", "current"] });
            showSuccessToast("Plano alterado com sucesso");
        },
        onError: () => {
            showErrorToast("Falha ao alterar plano");
        },
    });
}

export function useUploadPaymentProof() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: subscriptionsApi.uploadPaymentProof,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subscription", "history"] });
            showSuccessToast("Comprovativo enviado com sucesso");
        },
        onError: () => {
            showErrorToast("Erro ao enviar comprovativo");
        },
    });
}

export function useGetLatestInvoice() {
    return useQuery({
        queryKey: ["payments", "latest"],
        queryFn: subscriptionsApi.getLatestInvoice,
    });
}

export function useDownloadInvoice() {
    return useMutation({
        mutationFn: subscriptionsApi.downloadInvoice,
    });
}

export function usePauseSubscription() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: subscriptionsApi.pauseSubscription,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subscription", "current"] });
            showSuccessToast("Subscrição pausada");
        },
        onError: () => {
            showErrorToast("Erro ao pausar subscrição");
        },
    });
}

export function useResumeSubscription() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: subscriptionsApi.resumeSubscription,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subscription", "current"] });
            showSuccessToast("Subscrição retomada");
        },
        onError: () => {
            showErrorToast("Erro ao retomar subscrição");
        },
    });
}

export function useBackupAccountData() {
    return useMutation({
        mutationFn: subscriptionsApi.backupAccountData,
    });
}
