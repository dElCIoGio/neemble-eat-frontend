import {apiClient} from "@/api/axios";
import {TableSession} from "@/types/table-session";


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
    }

}