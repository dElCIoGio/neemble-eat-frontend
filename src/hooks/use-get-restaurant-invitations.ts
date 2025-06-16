import { useQuery } from "@tanstack/react-query";
import { invitationApi } from "@/api/endpoints/invitation/requests";
import { Invitation } from "@/types/invitation";

export function useGetRestaurantInvitations(restaurantId: string) {
    return useQuery<Invitation[]>({
        queryKey: ["invitations", restaurantId],
        queryFn: () => invitationApi.listRestaurantInvitations(restaurantId),
        enabled: !!restaurantId,
    });
}
