import { apiClient } from "@/api/axios";
import {UserRestaurants} from "@/api/endpoints/user/types";
import {Restaurant} from "@/types/restaurant";


const baseRoute = "/users"


export const userApi = {

    userExists: async () => {
        const result = await apiClient.get<boolean>(`${baseRoute}/exists`)
        return result.data
    },

    getUserRestaurants: async () => {
        const result = await apiClient.get<UserRestaurants[]>(`${baseRoute}/restaurants`)
        return result.data
    },

    getCurrentRestaurant: async () => {
        const result = await apiClient.get<Restaurant | undefined>(`${baseRoute}/restaurant`)
        return result.data
    },

    changeCurrentRestaurant: async (restaurantId: string) => {
        const result = await apiClient.put<boolean>(`${baseRoute}/restaurant/${restaurantId}`)
        return result.data
    }

}
