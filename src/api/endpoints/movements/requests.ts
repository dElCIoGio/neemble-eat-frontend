import {apiClient} from "@/api/axios";
import {Movement, MovementCreate} from "@/types/stock";

const baseRoute = "/movements";

export const movementsApi = {
    listMovements: async (restaurantId: string) => {
        const response = await apiClient.get<Movement[]>(`${baseRoute}/restaurant/${restaurantId}`);
        return response.data;
    },

    createMovement: async (restaurantId: string, data: MovementCreate) => {
        const response = await apiClient.post<Movement>(`${baseRoute}/restaurant/${restaurantId}`, data);
        return response.data;
    },
};
