import {apiClient} from "@/api/axios";
import {TableSession, TableSessionPaymentMethod} from "@/types/table-session";


const baseRoute = "/sessions";

export const sessionApi = {

    getActiveSession: async (tableId: string) => {
        const response = await apiClient.get<TableSession>(`${baseRoute}/active/${tableId}`);
        return response.data;
    },

    listSessions: async (tableId: string) => {
        const response = await apiClient.get<TableSession[]>(`${baseRoute}/table/${tableId}`);
        return response.data;
    },

    closeSession: async (sessionId: string) => {
        const response = await apiClient.post<TableSession>(`${baseRoute}/${sessionId}/close`);
        return response.data;
    },

    cancelSession: async (sessionId: string) => {
        const response = await apiClient.post<TableSession>(`${baseRoute}/${sessionId}/cancel`);
        return response.data;
    },

    getActiveSessionByTableNumber: async (tableNumber: number, restaurantId: string) => {
        const response = await apiClient.get<TableSession>(`${baseRoute}/active/${restaurantId}/${tableNumber}`);
        return response.data;
    },

    listActiveSessions: async (restaurantId: string) => {
        const response = await apiClient.get<TableSession[]>(`${baseRoute}/restaurant/${restaurantId}/active`);
        return response.data;
    },

    paySession: async (sessionId: string) => {
        const response = await apiClient.post<TableSession>(`${baseRoute}/${sessionId}/pay`);
        return response.data;
    },

    markSessionNeedsBill: async (sessionId: string, paymentMethod: TableSessionPaymentMethod) => {
        const response = await apiClient.post<TableSession>(`${baseRoute}/${sessionId}/needs-bill/${paymentMethod}`);
        return response.data;
    },

    cancelCheckout: async (sessionId: string) => {
        const response = await apiClient.post<TableSession>(`${baseRoute}/${sessionId}/cancel-checkout`);
        return response.data;
    },

    requestAssistance: async (sessionId: string) => {
        const request = await apiClient.post<TableSession>(`${baseRoute}/${sessionId}/request-assistance`);
        return request.data
    },

    cancelAssistanceRequest: async (sessionId: string) => {
        const request = await apiClient.post<TableSession>(`${baseRoute}/${sessionId}/cancel-assistance`);
        return request.data
    }
}