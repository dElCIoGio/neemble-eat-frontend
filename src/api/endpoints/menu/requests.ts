import {apiClient} from "@/api/axios";
import {Menu, MenuCreate, PartialMenu} from "@/types/menu";
import {Item} from "@/types/item";
import {Category} from "@/types/category";


const baseRoute = "/menus"


export const menuApi = {

    getRestaurantMenus: async (restaurantId: string) => {
        const response = await apiClient.get<Menu[]>(`${baseRoute}/restaurant/${restaurantId}`)
        return response.data
    },

    createMenu: async (payload: MenuCreate) => {
        const response = await apiClient.post<Menu>(`${baseRoute}/`, payload)
        return response.data
    },

    deleteMenu: async (menuId: string) => {
        const response = await apiClient.delete<boolean>(`${baseRoute}/${menuId}`)
        return response.data
    },

    getMenuBySlug: async (slug: string) => {
        const response = await apiClient.get<Menu>(`${baseRoute}/slug/${slug}`)
        return response.data
    },

    getMenuItemsBySlug: async (menuSlug: string) => {
        const response = await apiClient.get<Item[]>(`${baseRoute}/items/slug/${menuSlug}`)
        return response.data
    },

    copyMenu: async (menuSlug: string, restaurantId: string) => {
        const response = await apiClient.post<Menu>(`${baseRoute}/copy/${menuSlug}/${restaurantId}`)
        return response.data
    },

    getMenuCategories: async (menuId: string) => {
        const response = await apiClient.get<Category[]>(`${baseRoute}/${menuId}/categories`)
        return response.data
    },

    deactivateMenu: async (menuId: string) => {
        const response = await apiClient.put<Menu>(`${baseRoute}/${menuId}/deactivate`)
        return response.data
    },

    activateMenu: async (menuId: string) => {
        const response = await apiClient.put<Menu>(`${baseRoute}/${menuId}/activate`)
        return response.data
    },

    updateMenu: async (menuId: string, data: PartialMenu) => {
        const response = await apiClient.put<Menu>(`${baseRoute}/${menuId}/`, data);
        return response.data

    }

}