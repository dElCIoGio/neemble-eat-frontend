import {RestaurantUpcomingBookings} from "@/api/endpoints/booking/bookings";
import {apiClient} from "@/api/axios";
import {Booking} from "@/types/booking";


const baseRoute = "/bookings"


export const bookingsApi = {

    getRestaurantBookings: async (props: RestaurantUpcomingBookings) => {
        const response = await apiClient.get<Booking[]>(`${baseRoute}/upcoming/${props.restaurantId}`)
        return response.data;
    }

}