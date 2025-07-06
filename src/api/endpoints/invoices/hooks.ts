import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invoicesApi } from "./requests";
import { Invoice, PartialInvoice } from "@/types/invoice";

export function useGetInvoice(invoiceId: string | undefined) {
    const queryKey = ["invoice", invoiceId];
    return useQuery({
        queryKey,
        queryFn: () => (invoiceId ? invoicesApi.getInvoice(invoiceId) : undefined),
        enabled: typeof invoiceId === "string",
    });
}

export function useGetRestaurantInvoices(restaurantId: string | undefined) {
    const queryKey = ["restaurant invoices", restaurantId];
    return useQuery({
        queryKey,
        queryFn: () => (restaurantId ? invoicesApi.listRestaurantInvoices(restaurantId) : undefined),
        enabled: typeof restaurantId === "string",
    });
}

export function useGetSessionInvoices(sessionId: string | undefined) {
    const queryKey = ["session invoices", sessionId];
    return useQuery({
        queryKey,
        queryFn: () => (sessionId ? invoicesApi.listSessionInvoices(sessionId) : undefined),
        enabled: typeof sessionId === "string",
    });
}

export function useCreateInvoice() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: invoicesApi.createInvoice,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["restaurant invoices"] });
        },
    });
}

export function useUpdateInvoice(invoiceId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: PartialInvoice) => invoicesApi.updateInvoice(invoiceId, data),
        onSuccess: (invoice: Invoice) => {
            queryClient.setQueryData<Invoice>(["invoice", invoiceId], invoice);
        },
    });
}
