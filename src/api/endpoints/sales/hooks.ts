import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {salesApi} from "./requests";
import {Sale} from "@/types/stock";

export function useGetSales() {
    return useQuery({
        queryKey: ["sales"],
        queryFn: () => salesApi.listSales(),
    });
}

export function useRegisterSale(restaurantId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: {recipeId: string; quantity: number}) => salesApi.registerSale(restaurantId, data),
        onSuccess: (sale) => {
            queryClient.setQueryData<Sale[]>(["sales"], (old = []) => [sale, ...old]);
            queryClient.invalidateQueries({queryKey: ["stock-items", restaurantId]});
        },
    });
}
