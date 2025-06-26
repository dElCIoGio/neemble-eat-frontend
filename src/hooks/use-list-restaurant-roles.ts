import { useQuery, useQueryClient } from "@tanstack/react-query"
import { roleApi } from "@/api/endpoints/role/requests"
import { Role } from "@/types/role"



export function useListRestaurantRoles(restaurantId: string) {
    const queryClient = useQueryClient()

    const {data, ...query} = useQuery<Role[]>({
        queryKey: ["roles", restaurantId],
        queryFn: () => roleApi.listRestaurantRoles(restaurantId)
    })

    const addRole = (role: Role) => {
        queryClient.setQueryData<Role[]>(["roles", restaurantId], (old = []) => [...old, role])
    }

    const removeRole = (roleId: string) => {
        queryClient.setQueryData<Role[]>(["roles", restaurantId], (old = []) =>
            old.filter(role => role._id !== roleId)
        )
    }

    const updateRole = (updated: Role) => {
        queryClient.setQueryData<Role[]>(["roles", restaurantId], (old = []) =>
            old.map(role => role._id === updated._id ? updated : role)
        )
    }

    return {
        data: data ? data : [],
        ...query,
        addRole,
        removeRole,
        updateRole
    }
}
