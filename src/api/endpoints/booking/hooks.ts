import {RestaurantUpcomingBookings} from "@/api/endpoints/booking/bookings";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {bookingsApi} from "@/api/endpoints/booking/requests";
import {Booking, BookingCreate} from "@/types/booking";
import {BookingUpdate} from "@/types/update-types";
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

    const updateBooking = (updated: Booking) => {
        queryClient.setQueryData<Booking[]>(queryKey, (old = []) => old.map(b => b._id === updated._id ? updated : b));

    const query = useQuery({
        queryKey,
        queryFn: () => bookingsApi.getRestaurantBookings(props),
        enabled: !!props.restaurantId
    });

    return {
        ...query,
        addBooking,
        removeBooking,
        updateBooking
    };

}

export function useGetRestaurantBookingsByDate(props: { restaurantId: string; date?: Date }){

    const queryClient = useQueryClient();
    const formatted = props.date ? props.date.toISOString() : undefined;
    const queryKey = ["bookingsByDate", props.restaurantId, formatted ?? "upcoming"];

    const addBooking = (booking: Booking) => {
        queryClient.setQueryData<Booking[]>(queryKey, (old = []) => [booking, ...old]);
    };

    const removeBooking = (bookingId: string) => {
        queryClient.setQueryData<Booking[]>(queryKey, (old = []) => old.filter(b => b._id !== bookingId));
    };
    const updateBooking = (updated: Booking) => {
        queryClient.setQueryData<Booking[]>(queryKey, (old = []) => old.map(b => b._id === updated._id ? updated : b));
    };

    const query = useQuery({
        queryKey,
        queryFn: () => {
            if (formatted){
                return bookingsApi.getBookingByDate(props.restaurantId, formatted);
            }
            return bookingsApi.getRestaurantBookings({ restaurantId: props.restaurantId });
        },
        enabled: !!props.restaurantId,
    });

    return {
        ...query,
        addBooking,
        removeBooking,
        updateBooking
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

export function useUpdateBooking(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({bookingId, data}: {bookingId: string, data: BookingUpdate}) =>
            bookingsApi.updateBooking(data, bookingId),
        onSuccess: (booking) => {
            queryClient.invalidateQueries({queryKey: ["bookingsByDate", booking.restaurantId]});
            queryClient.setQueryData<Booking[]>(["upcoming", booking.restaurantId], (old = []) => old.map(b => b._id === booking._id ? booking : b));
            showSuccessToast("Reserva atualizada com sucesso");
        },
        onError: () => {
            showErrorToast("Falha ao atualizar reserva");
        }
    });
}