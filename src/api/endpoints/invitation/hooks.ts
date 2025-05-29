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