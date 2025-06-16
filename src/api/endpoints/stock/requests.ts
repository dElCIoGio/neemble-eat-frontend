import {apiClient} from "@/api/axios";
import {StockItem, StockItemCreate} from "@/types/stock";

const baseRoute = "/stock";

export const stockApi = {
    listItems: async (restaurantId: string) => {
        const response = await apiClient.get<StockItem[]>(`${baseRoute}/restaurant/${restaurantId}`);
        return response.data;
    },

    createItem: async (restaurantId: string, data: StockItemCreate) => {
        const response = await apiClient.post<StockItem>(`${baseRoute}/restaurant/${restaurantId}`, data);
        return response.data;
    },

    updateItem: async (id: string, data: Partial<StockItem>) => {
        const response = await apiClient.put<StockItem>(`${baseRoute}/${id}`, data);
        return response.data;
    },

    deleteItem: async (id: string) => {
        const response = await apiClient.delete(`${baseRoute}/${id}`);
        return response.data;
    },

    addStock: async (id: string, data: {quantity: number; reason?: string}) => {
        const response = await apiClient.post<StockItem>(`${baseRoute}/${id}/add`, data);
        return response.data;
    },

    removeStock: async (id: string, data: {quantity: number; reason?: string}) => {
        const response = await apiClient.post<StockItem>(`${baseRoute}/${id}/remove`, data);
        return response.data;
    },
};
