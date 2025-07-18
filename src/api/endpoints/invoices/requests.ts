import { apiClient } from "@/api/axios";
import { Invoice, InvoiceCreate, PartialInvoice } from "@/types/invoice";
import {InvoiceData} from "@/lib/templates/invoice";

const baseRoute = "/invoices";

export const invoicesApi = {
    createInvoice: async (data: InvoiceCreate) => {
        const response = await apiClient.post<Invoice>(`${baseRoute}/`, data);
        return response.data;
    },

    getInvoice: async (invoiceId: string) => {
        const response = await apiClient.get<Invoice>(`${baseRoute}/${invoiceId}`);
        return response.data;
    },

    updateInvoice: async (invoiceId: string, data: PartialInvoice) => {
        const response = await apiClient.put<Invoice>(`${baseRoute}/${invoiceId}`, data);
        return response.data;
    },

    deleteInvoice: async (invoiceId: string) => {
        const response = await apiClient.delete<boolean>(`${baseRoute}/${invoiceId}`);
        return response.data;
    },

    listInvoices: async () => {
        const response = await apiClient.get<Invoice[]>(`${baseRoute}`);
        return response.data;
    },

    listRestaurantInvoices: async (restaurantId: string) => {
        const response = await apiClient.get<Invoice[]>(`${baseRoute}/restaurant/${restaurantId}`);
        return response.data;
    },

    listSessionInvoices: async (sessionId: string) => {
        const response = await apiClient.get<Invoice[]>(`${baseRoute}/session/${sessionId}`);
        return response.data;
    },

    markInvoicePaid: async (invoiceId: string) => {
        const response = await apiClient.put<Invoice>(`${baseRoute}/${invoiceId}/pay`);
        return response.data;
    },

    cancelInvoice: async (invoiceId: string) => {
        const response = await apiClient.post<Invoice>(`${baseRoute}/${invoiceId}/cancel`);
        return response.data;
    },

    getInvoiceData: async (invoiceId: string) => {
        const response = await apiClient.get<InvoiceData>(`${baseRoute}/${invoiceId}/data`);
        console.log(response.data)
        return response.data;
    }


};
