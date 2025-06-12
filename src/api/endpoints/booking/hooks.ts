import {RestaurantUpcomingBookings} from "@/api/endpoints/booking/bookings";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {bookingsApi} from "@/api/endpoints/booking/requests";
import {Booking, BookingCreate} from "@/types/booking";
import {showErrorToast, showSuccessToast} from "@/utils/notifications/toast";


export function useGetRestaurantUpcomingBookings(props: RestaurantUpcomingBookings){

    const queryClient = useQueryClient();
    const queryKey = ["upcoming", props.restaurantId];

    const addBooking = (booking: Booking) => {
        queryClient.setQueryData<Booking[]>(queryKey, (old = []) => [booking, ...old]);
    };

    const removeBooking = (bookingId: string) => {
        queryClient.setQueryData<Booking[]>(queryKey, (old = []) => old.filter(b => b._id !== bookingId));
    };

    const query = useQuery({
        queryKey,
        queryFn: () => bookingsApi.getRestaurantBookings(props),
        enabled: !!props.restaurantId
    });

    return {
        ...query,
        addBooking,
        removeBooking
    };

}

export function useCreateBooking(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: BookingCreate) => bookingsApi.createBooking(data),
        onSuccess: (booking) => {
            queryClient.setQueryData<Booking[]>(["upcoming", booking.restaurantId], (old = []) => [booking, ...old]);
            showSuccessToast("Reserva criada com sucesso");
        },
        onError: () => {
            showErrorToast("Falha ao criar reserva");
        }
    });
}