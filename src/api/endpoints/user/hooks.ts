import {useAuth} from "@/context/auth-context";
import {useQuery} from "@tanstack/react-query";
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