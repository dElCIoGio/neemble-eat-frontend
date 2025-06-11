import {useAuth} from "@/context/auth-context";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {userApi} from "@/api/endpoints/user/endpoints";


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