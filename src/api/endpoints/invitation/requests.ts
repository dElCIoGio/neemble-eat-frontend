import {api} from "@/api";
import {Invitation} from "@/types/invitation.ts";


const baseRoute = "/invitations"


export const invitationApi = {
    getEmailInvitations: async (email: string) =>
        await api.get<Invitation[]>(`${baseRoute}/${email}/email`)
}