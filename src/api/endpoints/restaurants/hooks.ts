import {GetRestaurantMembersProps} from "@/api/endpoints/restaurants/types";
import {useQuery, useQueryClient, useMutation} from "@tanstack/react-query";
import {restaurantApi} from "@/api/endpoints/restaurants/requests";
import {User} from "@/types/user";
import {OpeningHours} from "@/types/restaurant";
import {showSuccessToast, showErrorToast} from "@/utils/notifications/toast";

export function useGetAllMembers(props: GetRestaurantMembersProps) {

    const queryClient = useQueryClient();
    const queryKey = ["restaurant members", props.restaurantId]

    // Function to add a member
    const addMember = (newMember: User) => {
        queryClient.setQueryData(queryKey, (oldData: User[] | undefined) => {
            if (!oldData) return [newMember];
            return [...oldData, newMember];
        });
    };

    // Function to remove a member by ID
    const removeMember = (sessionId: string) => {
        queryClient.setQueryData(queryKey, (oldData: User[] | undefined) => {
            if (!oldData) return [];
            return oldData.filter((member) => member._id !== sessionId);
        });
    };

    const query = useQuery({
        queryKey,
        queryFn: () => restaurantApi.getAllMembers(props),
        enabled: !!props.restaurantId,
    })

    return {
        ...query,
        addMember,
        removeMember,
    }

}


export function useGetRestaurantBySlug(slug: string) {

    const queryKey = ["restaurant", "slug", slug]

    return useQuery({
        queryKey,
        queryFn: () => restaurantApi.getRestaurantBySlug(slug),
    })

}

export function useGetRestaurant(restaurantId: string | undefined){
    const queryKey = ["restaurant", restaurantId]
    return useQuery({
        queryKey,
        queryFn: () => typeof restaurantId === "undefined" ? undefined : restaurantApi.getRestaurant(restaurantId),
        enabled: typeof restaurantId === "string",
    })
}


export function useGetCurrentMenu(restaurantId: string | undefined){

    const queryKey = ["current", "menu", restaurantId]

    return useQuery({
        queryKey,
        queryFn: () => typeof restaurantId == "undefined"? undefined: restaurantApi.getCurrentMenu(restaurantId),
        enabled: typeof restaurantId == "string"
    })

}

export function useUpdateRestaurantOpeningHours(restaurantId: string) {
    const queryClient = useQueryClient()
    const queryKey = ["restaurant", restaurantId]

    return useMutation({
        mutationFn: (openingHours: OpeningHours) =>
            restaurantApi.updateRestaurantOpeningHours(restaurantId, openingHours),
        onSuccess: (restaurant) => {
            queryClient.setQueryData(queryKey, restaurant)
            showSuccessToast("Horário atualizado com sucesso")
        },
        onError: () => {
            showErrorToast("Falha ao atualizar horário")
        },
    })
}

export function useUpdateRestaurantBanner(restaurantId: string) {
    const queryClient = useQueryClient()
    const queryKey = ["restaurant", restaurantId]

    return useMutation({
        mutationFn: (file: File) =>
            restaurantApi.updateRestaurantBanner(restaurantId, file),
        onSuccess: (restaurant) => {
            queryClient.setQueryData(queryKey, restaurant)
            showSuccessToast("Banner atualizado com sucesso")
        },
        onError: () => {
            showErrorToast("Falha ao atualizar banner")
        },
    })
}

export function useUpdateRestaurantLogo(restaurantId: string) {
    const queryClient = useQueryClient()
    const queryKey = ["restaurant", restaurantId]

    return useMutation({
        mutationFn: (file: File) =>
            restaurantApi.updateRestaurantLogo(restaurantId, file),
        onSuccess: (restaurant) => {
            queryClient.setQueryData(queryKey, restaurant)
            showSuccessToast("Logo atualizado com sucesso")
        },
        onError: () => {
            showErrorToast("Falha ao atualizar logo")
        },
    })
}
