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
        return response.data
    }
}