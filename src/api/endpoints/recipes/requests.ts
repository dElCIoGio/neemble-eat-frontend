import {apiClient} from "@/api/axios";
import {Recipe, RecipeCreate} from "@/types/stock";

const baseRoute = "/recipes";

export const recipesApi = {
    listRecipes: async (restaurantId: string) => {
        const response = await apiClient.get<Recipe[]>(`${baseRoute}/${restaurantId}`);
        return response.data;
    },

    createRecipe: async (restaurantId: string, data: RecipeCreate) => {
        const response = await apiClient.post<Recipe>(`${baseRoute}/${restaurantId}`, data);
        return response.data;
    },

    updateRecipe: async (id: string, data: Partial<Recipe>) => {
        const response = await apiClient.put<Recipe>(`${baseRoute}/${id}`, data);
        return response.data;
    },

    deleteRecipe: async (id: string) => {
        const response = await apiClient.delete(`${baseRoute}/${id}`);
        return response.data;
    },
};
