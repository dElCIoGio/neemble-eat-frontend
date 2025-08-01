import { apiClient } from "@/api/axios";
import {UserRestaurants} from "@/api/endpoints/user/types";
import {Restaurant} from "@/types/restaurant";
import {Role} from "@/types/role";
import {PartialUser, Preferences, User} from "@/types/user";


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
    },

    getCurrentRole: async () => {
        const result = await apiClient.get<Role>(`${baseRoute}/role`)
        return result.data
    },

    getUser: async (userId: string) => {
        const result = await apiClient.get<User>(`${baseRoute}/user/${userId}`)
        return result.data
    },

    setCurrentRestaurantById: async (restaurantId: string) => {
        const result = await apiClient.put(`${baseRoute}/restaurant/${restaurantId}`)
        return result.data
    },

    updatePreferences: async (preferences: Preferences) => {
        const result = await apiClient.put<User>(`${baseRoute}/preferences`, preferences);
        return result.data
    },

    userUpdate: async (userId: string, data: PartialUser) => {
        const response = await apiClient.put(`${baseRoute}/user/${userId}`, data);
        return response.data
    }

}

