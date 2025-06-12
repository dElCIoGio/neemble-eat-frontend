import {RestaurantUpcomingBookings} from "@/api/endpoints/booking/bookings";
import {apiClient} from "@/api/axios";
import {Booking, BookingCreate} from "@/types/booking";
import {BookingUpdate} from "@/types/update-types";


const baseRoute = "/bookings"


export const bookingsApi = {

    getRestaurantBookings: async (props: RestaurantUpcomingBookings) => {
        const response = await apiClient.get<Booking[]>(`${baseRoute}/upcoming/${props.restaurantId}`)
        return response.data;
    },

    createBooking: async (data: BookingCreate) => {
        const response = await apiClient.post<Booking>(`${baseRoute}/`, data);
        return response.data;
    },

    updateBooking: async (data: BookingUpdate, bookingId: string) => {
        const response = await apiClient.put<Booking>(`${baseRoute}/${bookingId}`, data);
        return response.data;
    },

    deleteBooking: async (bookingId: string) => {
        const response = await apiClient.delete<boolean>(`${baseRoute}/${bookingId}`)
        return response.data;
    },

    listAllRestaurantBookings: async (restaurantId: string) => {
        const response = await apiClient.get<Booking[]>(`${baseRoute}/restaurant/${restaurantId}`)
        return response.data;
    },

    listAllTableBookings: async (tableId: string) => {
        const response = await apiClient.get<Booking[]>(`${baseRoute}/table/${tableId}`)
        return response.data;
    },

    getBookingByDate: async (restaurantId: string, day: string /* the day must be in isoformat*/) => {
        const response = await apiClient.get<Booking[]>(`${baseRoute}/date/${restaurantId}/${day}`);
        return response.data;
    }

}