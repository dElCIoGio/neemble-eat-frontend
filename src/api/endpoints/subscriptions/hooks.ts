import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionsApi } from "./requests";
import { showSuccessToast, showErrorToast } from "@/utils/notifications/toast";
import { Plan } from "@/types/subscription";

export function useGetCurrentSubscription() {
    return useQuery({
        queryKey: ["subscription", "current"],
        queryFn: subscriptionsApi.getCurrentSubscription,
    });
}

export function useGetUserCurrentSubscription(userId: string | undefined) {
    return useQuery({
        queryKey: ["subscription", "user", userId, "current"],
        queryFn: () => (userId ? subscriptionsApi.getUserCurrentSubscription(userId) : undefined),
        enabled: typeof userId === "string",
    });
}

export function usePaginateSubscriptions(params?: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = params || {};
    return useQuery({
        queryKey: ["subscriptions", "paginate", page, limit],
        queryFn: () => subscriptionsApi.paginateSubscriptions(params),
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

export function useGetActivePlans() {
    return useQuery({
        queryKey: ["plans", "active"],
        queryFn: subscriptionsApi.listActivePlans,
    });
}

export function useGetPlan(planId: string | undefined) {
    return useQuery({
        queryKey: ["plan", planId],
        queryFn: () => (planId ? subscriptionsApi.getPlan(planId) : undefined),
        enabled: typeof planId === "string",
    });
}

export function usePaginatePlans(params?: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = params || {};
    return useQuery({
        queryKey: ["plans", "paginate", page, limit],
        queryFn: () => subscriptionsApi.paginatePlans(params),
    });
}

export function useCreatePlan() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: subscriptionsApi.createPlan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["plans"] });
            showSuccessToast("Plano criado com sucesso");
        },
        onError: () => {
            showErrorToast("Erro ao criar plano");
        },
    });
}

export function useUpdatePlan(planId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<Plan>) => subscriptionsApi.updatePlan(planId, data),
        onSuccess: (plan: Plan) => {
            queryClient.setQueryData(["plan", planId], plan);
            showSuccessToast("Plano atualizado com sucesso");
        },
        onError: () => {
            showErrorToast("Erro ao atualizar plano");
        },
    });
}

export function useDeletePlan() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (planId: string) => subscriptionsApi.deletePlan(planId),
        onSuccess: (_, planId) => {
            queryClient.removeQueries({ queryKey: ["plan", planId] });
            queryClient.invalidateQueries({ queryKey: ["plans"] });
            showSuccessToast("Plano removido com sucesso");
        },
        onError: () => {
            showErrorToast("Erro ao remover plano");
        },
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

export function useSubscribe() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: subscriptionsApi.subscribe,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subscription", "current"] });
            showSuccessToast("Subscrição realizada com sucesso");
        },
        onError: () => {
            showErrorToast("Erro ao subscrever plano");
        },
    });
}

export function useUnsubscribe() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (subscriptionId: string) => subscriptionsApi.unsubscribe(subscriptionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subscription", "current"] });
            showSuccessToast("Subscrição cancelada");
        },
        onError: () => {
            showErrorToast("Erro ao cancelar subscrição");
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
        mutationFn: ({ subscriptionId, reason }: { subscriptionId: string; reason?: string }) =>
            subscriptionsApi.pauseSubscription(subscriptionId, { reason }),
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
        mutationFn: (subscriptionId: string) => subscriptionsApi.resumeSubscription(subscriptionId),
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
