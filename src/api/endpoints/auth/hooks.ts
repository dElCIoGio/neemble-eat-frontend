import {useAuth} from "@/context/auth-context";
import {useMutation, useQuery} from "@tanstack/react-query";
import {authApi} from "@/api/endpoints/auth/endpoints";
import {showErrorToast, showSuccessToast} from "@/utils/notifications/toast";
import {RegisterPayload} from "@/api/endpoints/auth/types";


export function useMe() {

    const {user} = useAuth()

    const queryKey = ["me", user? user.uid : ""]

    return useQuery({
        queryKey,
        queryFn: authApi.me,
        select: (user) => ({
            ...user,
            createdAt: new Date(user.createdAt),
        }),
    })
}


export function useRegister(){

    // const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: RegisterPayload) => authApi.register(data),
        onSuccess: () => {
            showSuccessToast("Reserva criada com sucesso");
        },
        onError: () => {
            showErrorToast("Falha ao criar reserva");
        }
    });

}