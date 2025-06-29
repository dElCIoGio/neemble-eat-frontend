import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {membershipsApi} from "@/api/endpoints/memberships/requests";
import {showSuccessToast, showErrorToast} from "@/utils/notifications/toast";


export function useGetUserMemberships(userId: string, restaurantId: string) {

    const queryKey = ["memberships", userId, restaurantId]

    return useQuery({
        queryKey,
        queryFn: () => membershipsApi.getUserMembership(userId, restaurantId)
    })

}

export function useUpdateMemberRole() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({userId, restaurantId, roleId}: {userId: string, restaurantId: string, roleId: string}) =>
            membershipsApi.updateRole(userId, restaurantId, roleId),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({queryKey: ["members", variables.restaurantId]})
            queryClient.invalidateQueries({queryKey: ["restaurant members", variables.restaurantId]})
            showSuccessToast("Função atualizada")
        },
        onError: () => {
            showErrorToast("Erro ao atualizar função")
        }
    })
}