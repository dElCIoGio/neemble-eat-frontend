import {GetRestaurantMembersProps} from "@/api/endpoints/restaurants/types";
import {useQuery} from "@tanstack/react-query";
import {restaurantApi} from "@/api/endpoints/restaurants/endpoints";


export function useGetAllMembers(props: GetRestaurantMembersProps) {

    const queryKey = ["restaurant members", props.restaurantId]

    return useQuery({
        queryKey,
        queryFn: () => restaurantApi.getAllMembers(props)
    })

}