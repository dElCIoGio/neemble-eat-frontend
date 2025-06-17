import {useQuery} from "@tanstack/react-query";
import {invitationApi} from "@/api/endpoints/invitation/requests";


export function useGetEmailInvitations(email: string) {
    const queryKey = ["useGetEmailInvitations"]
    return useQuery({
        queryKey,
        queryFn: () => invitationApi.getEmailInvitations(email)
            .then(res => res.data)
    })
}

export function useGetInvitation(invitationId: string | undefined){
    const queryKey = ["invitation", invitationId]
    return useQuery({
        queryKey,
        queryFn: () => typeof invitationId === "undefined" ? undefined : invitationApi.getInvitation(invitationId),
        enabled: typeof invitationId === "string",
    })
}