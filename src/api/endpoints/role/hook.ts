import {useQuery, useQueryClient} from "@tanstack/react-query";
import {roleApi} from "@/api/endpoints/role/requests";
import {User} from "@/types/user";
import {Role} from "@/types/role";


export function useGetRole(roleId: string | undefined) {

    const queryKey = ["role", roleId]

    return useQuery({
        queryKey,
        queryFn: () => roleId? roleApi.getRole(roleId): undefined,
        enabled: typeof roleId !== "undefined",
    })

}


export function useListRestaurantRoles(restaurantId: string) {

    const queryClient = useQueryClient();
    const queryKey = ["restaurant roles", restaurantId];

    // Function to add a member
    const addRole = (newRole: Role) => {
        queryClient.setQueryData(queryKey, (oldData: User[] | undefined) => {
            if (!oldData) return [newRole];
            return [...oldData, newRole];
        });
    };

    // Function to remove a member by ID
    const removeRole = (roleId: string) => {
        queryClient.setQueryData(queryKey, (oldData: User[] | undefined) => {
            if (!oldData) return [];
            return oldData.filter((member) => member._id !== roleId);
        });
    };

    const query = useQuery({
        queryKey,
        queryFn: () => roleApi.listRestaurantRoles(restaurantId),
        enabled: typeof restaurantId !== "undefined",
    })


    return {
        ...query,
        addRole,
        removeRole,
    }

}