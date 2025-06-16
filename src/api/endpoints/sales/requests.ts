import {apiClient} from "@/api/axios";
import {Sale} from "@/types/stock";

const baseRoute = "/sales";

export const salesApi = {
    listSales: async () => {
        const response = await apiClient.get<Sale[]>(`${baseRoute}`);
        return response.data;
    },

    registerSale: async (restaurantId: string, data: {recipeId: string; quantity: number}) => {
        const response = await apiClient.post<Sale>(`${baseRoute}/restaurant/${restaurantId}`, data);
        return response.data;
    },
};
