import { useQuery } from "@tanstack/react-query"
import { restaurantApi } from "@/api/endpoints/restaurants/requests"
import { User } from "@/types/user"

interface UseGetAllMembersParams {
    restaurantId: string
}

export function useGetAllMembers({ restaurantId }: UseGetAllMembersParams) {
    return useQuery<User[]>({
        queryKey: ["members", restaurantId],
        queryFn: () => restaurantApi.getAllMembers({ restaurantId })
    })
} 