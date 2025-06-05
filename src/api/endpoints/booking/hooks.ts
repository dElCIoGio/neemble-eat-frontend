import {RestaurantUpcomingBookings} from "@/api/endpoints/booking/bookings";
import {useQuery} from "@tanstack/react-query";
import {bookingsApi} from "@/api/endpoints/booking/requests";


export function useGetRestaurantUpcomingBookings(props: RestaurantUpcomingBookings){

    const queryKey = ["upcoming", props.restaurantId];
    return useQuery({
        queryKey,
        queryFn: () => bookingsApi.getRestaurantBookings(props)
    })

}