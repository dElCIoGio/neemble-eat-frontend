import {apiClient} from "@/api/axios";
import {Category, CategoryCreate} from "@/types/category";
import {Item} from "@/types/item";


const baseRoute = "/categories"


export const categoryApi = {

    getRestaurantCategories: async (restaurantId: string) => {
        const response = await apiClient.get<Category[]>(`${baseRoute}/restaurant/${restaurantId}`)
        return response.data
    },

    deleteCategory: async (categoryId: string) => {
        const response = await apiClient.delete<boolean>(`${baseRoute}/${categoryId}`)
        return response.data
    },

    getMenuCategoriesBySlug: async (menuSlug: string) => {
        const response = await apiClient.get<Category[]>(`${baseRoute}/menu/slug/${menuSlug}`)
        return response.data
    },

    createCategory: async (categoryData: CategoryCreate) => {
        const response = await apiClient.post(`${baseRoute}/`, categoryData)
        return response.data
    },

    getCategoryBySlug: async (categorySlug: string) => {
        const response = await apiClient.get<Category>(`${baseRoute}/slug/${categorySlug}`)
        return response.data
    },

    updateCategory: async (categoryId: string, updateData: Partial<Category>) => {
        const response = await apiClient.put<Category>(`${baseRoute}/${categoryId}`, updateData)
        return response.data
    },

    switchCategoryAvailability: async (categoryId: string, isActive: boolean) => {
        const response = await apiClient.put<boolean>(`${baseRoute}/availability/${categoryId}`, {isActive})
        return response.data
    },

    getCategoryItems: async (categoryId: string) => {
        const response = await apiClient.get<Item[]>(`${baseRoute}/${categoryId}/items`)
        return response.data
    },
}