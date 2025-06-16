import {api} from "@/api";
import {Invitation, InvitationCreate} from "@/types/invitation";
import {apiClient} from "@/api/axios";


const baseRoute = "/invitations"


export const invitationApi = {
    getEmailInvitations: async (email: string) =>
        await api.get<Invitation[]>(`${baseRoute}/${email}/email`),

    listRestaurantInvitations: async (restaurantId: string) => {
        const response = await apiClient.get<Invitation[]>(`${baseRoute}/restaurant/${restaurantId}`)
        return response.data
    },

    createInvitation: async (invitation: InvitationCreate) => {
        const response = await apiClient.post<Invitation>(`${baseRoute}/`, invitation)
        return response.data
    },

    deleteInvitation: async (invitationId: string) => {
        const response = await apiClient.delete<boolean>(`${baseRoute}/${invitationId}`);
        return response.data
    }
}