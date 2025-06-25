import {apiClient} from "@/api/axios";
import {GetRestaurantMembersProps} from "@/api/endpoints/restaurants/types";
import {User} from "@/types/user";
import {Restaurant} from "@/types/restaurant";
import {Menu} from "@/types/menu";

const baseRoute = "/restaurants";



export const restaurantApi = {
    createRestaurant: async (formData: FormData): Promise<void> => {
        return await apiClient.post(`${baseRoute}/`, formData)
    },

    getAllMembers: async (props: GetRestaurantMembersProps) => {
        const response = await apiClient.get<User[]>(`${baseRoute}/members/${props.restaurantId}`)
        console.log(response.data)
        return response.data
    },

    removeMember: async (restaurantId: string, userId: string) => {
        const response = await apiClient.delete(`${baseRoute}/${restaurantId}/members/${userId}`)
        return response.data
    },

    getRestaurantBySlug: async (slug: string) => {
        const response = await apiClient.get<Restaurant>(`${baseRoute}/slug/${slug}`)
        return response.data
    },

    getRestaurant: async (restaurantId: string) => {
        const response = await apiClient.get<Restaurant>(`${baseRoute}/${restaurantId}`)
        return response.data
    },


    getCurrentMenu: async (restaurantId: string) => {
        const response = await apiClient.get<Menu>(`${baseRoute}/${restaurantId}/menu`)
        return response.data
    },

    changeCurrentMenu: async (restaurantId: string, menuId: string) => {
        const response = await apiClient.put<boolean>(`${baseRoute}/${restaurantId}/current-menu/${menuId}`)
        return response.data
    }
}