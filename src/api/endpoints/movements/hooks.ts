import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {movementsApi} from "./requests";
import {Movement, MovementCreate} from "@/types/stock";

export function useGetMovements(restaurantId: string) {
    const queryClient = useQueryClient();
    const queryKey = ["movements", restaurantId];

    const addMovement = (movement: Movement) => {
        queryClient.setQueryData<Movement[]>(queryKey, (old = []) => [movement, ...old]);
    };

    const query = useQuery({
        queryKey,
        queryFn: () => movementsApi.listMovements(restaurantId),
        enabled: !!restaurantId,
    });

    return { ...query, addMovement };
}

export function useCreateMovement(restaurantId: string) {
    const queryClient = useQueryClient();
    const queryKey = ["movements", restaurantId];

    return useMutation({
        mutationFn: (data: MovementCreate) => movementsApi.createMovement(restaurantId, data),
        onSuccess: (movement) => {
            queryClient.setQueryData<Movement[]>(queryKey, (old = []) => [movement, ...old]);
        },
    });
}
