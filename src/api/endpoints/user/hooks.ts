import {useAuth} from "@/context/auth-context";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {userApi} from "@/api/endpoints/user/endpoints";
import {Preferences} from "@/types/user";
import {showSuccessToast, showErrorToast} from "@/utils/notifications/toast";


export function useGetUserRestaurants(){

    const {
        user
    } = useAuth()

    const queryKey = ["user", "restaurants", user?.uid]

    return useQuery({
        queryKey,
        queryFn: userApi.getUserRestaurants
    })
}


export function useGetCurrentRestaurant() {

    const queryKey = ["currentRestaurantId"]

    return useQuery({
        queryKey,
        queryFn: userApi.getCurrentRestaurant
    })

}


export function useGetCurrentRole() {

    const queryKey = ["role"]

    return useQuery({
        queryKey,
        queryFn: userApi.getCurrentRole
    })

}

export function useGetUser(userId: string | undefined) {
    const queryKey = ["user", userId]
    return useQuery({
        queryKey,
        queryFn: () => typeof userId === "undefined" ? undefined : userApi.getUser(userId),
        enabled: typeof userId === "string",
    })
}


export function useSetCurrentRestaurant() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (restaurantId: string) => userApi.setCurrentRestaurantById(restaurantId),
        onSuccess: () => {
            // Invalidate so useGetCurrentRestaurant picks up the new value
            queryClient.invalidateQueries({ queryKey: ["currentRestaurantId"] });
        },
    });
}

export function useUpdatePreferences() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (preferences: Preferences) => userApi.updatePreferences(preferences),
        onSuccess: (user) => {
            queryClient.setQueryData(["me"], user);
            queryClient.invalidateQueries({ queryKey: ["me"] });
            showSuccessToast("Preferences updated successfully");
        },
        onError: () => {
            showErrorToast("Failed to update preferences");
        },
    });
}