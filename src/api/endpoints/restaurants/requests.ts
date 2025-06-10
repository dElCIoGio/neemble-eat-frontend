import {apiClient} from "@/api/axios";
import {GetRestaurantMembersProps} from "@/api/endpoints/restaurants/types";
import {User} from "@/types/user";

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
    }
}