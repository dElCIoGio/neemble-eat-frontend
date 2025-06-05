import {apiClient} from "@/api/axios";
import {Menu, MenuCreate} from "@/types/menu";
import {Item} from "@/types/item";


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
    }

}