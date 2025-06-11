import {useQuery} from "@tanstack/react-query";
import {membershipsApi} from "@/api/endpoints/memberships/requests";


export function useGetUserMemberships(userId: string, restaurantId: string) {

    const queryKey = ["memberships", userId, restaurantId]

    return useQuery({
        queryKey,
        queryFn: () => membershipsApi.getUserMembership(userId, restaurantId)
    })

}