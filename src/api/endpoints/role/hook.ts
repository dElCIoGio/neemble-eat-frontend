import {useQuery, useQueryClient, useMutation} from "@tanstack/react-query";
import {roleApi} from "@/api/endpoints/role/requests";
import {User} from "@/types/user";
import {Role, PartialRole} from "@/types/role";
import {showSuccessToast, showErrorToast} from "@/utils/notifications/toast";


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

export function useUpdateRole(restaurantId: string) {
    const queryClient = useQueryClient()
    const queryKey = ["roles", restaurantId]

    return useMutation({
        mutationFn: ({roleId, data}: {roleId: string; data: PartialRole}) => roleApi.updateRole(roleId, data),
        onSuccess: (role) => {
            queryClient.setQueryData<Role[]>(queryKey, (old = []) =>
                old.map(r => r._id === role._id ? role : r)
            )
            showSuccessToast("Função atualizada com sucesso")
        },
        onError: () => {
            showErrorToast("Erro ao atualizar função")
        }
    })
}