import {apiClient} from "@/api/axios";
import {Membership, User} from "@/types/user";


const baseRoute = "/memberships"

export const membershipsApi = {

    getUserMembership: async (userId: string, restaurantId: string) => {
        const result = await apiClient.get<Membership>(`${baseRoute}/${userId}/restaurant/${restaurantId}`)
        return result.data
    },

    activateMembership: async (userId: string, restaurantId: string) => {
        const result = await apiClient.put<User>(`${baseRoute}/${userId}/restaurant/${restaurantId}/activate`)
        return result.data
    },

    deactivateMembership: async (userId: string, restaurantId: string) => {
        const result = await apiClient.put<User>(`${baseRoute}/${userId}/restaurant/${restaurantId}/deactivate`)
        return result.data
    },

    updateRole: async (userId: string, restaurantId: string, roleId: string) => {
        const result = await apiClient.put<Membership>(
            `${baseRoute}/${userId}/restaurant/${restaurantId}/role/${roleId}`
        )
        return result.data
    },

    g: async (userId: string, roleId: string) => {
        const response = await apiClient.post<User>(`${baseRoute}/`, {data: {userId, roleId}})
        return response.data
    }


}