import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {stockApi} from "@/api/endpoints/stock/requests";
import {StockItem, StockItemCreate} from "@/types/stock";

export function useGetStockItems(restaurantId: string) {
    const queryClient = useQueryClient();
    const queryKey = ["stock-items", restaurantId];

    const addItem = (item: StockItem) => {
        queryClient.setQueryData<StockItem[]>(queryKey, (old = []) => [...old, item]);
    };
    const removeItem = (id: string) => {
        queryClient.setQueryData<StockItem[]>(queryKey, (old = []) => old.filter(i => i._id !== id));
    };
    const updateItem = (updated: StockItem) => {
        queryClient.setQueryData<StockItem[]>(queryKey, (old = []) => old.map(i => i._id === updated._id ? updated : i));
    };

    const query = useQuery({
        queryKey,
        queryFn: () => stockApi.listItems(restaurantId),
        enabled: !!restaurantId,
    });

    return { ...query, addItem, removeItem, updateItem };
}

export function useCreateStockItem(restaurantId: string) {
    const queryClient = useQueryClient();
    const queryKey = ["stock-items", restaurantId];

    return useMutation({
        mutationFn: (data: StockItemCreate) => stockApi.createItem(restaurantId, data),
        onSuccess: (item) => {
            queryClient.setQueryData<StockItem[]>(queryKey, (old = []) => [...old, item]);
        },
    });
}

export function useUpdateStockItem(restaurantId: string) {
    const queryClient = useQueryClient();
    const queryKey = ["stock-items", restaurantId];

    return useMutation({
        mutationFn: ({id, data}: {id: string; data: Partial<StockItem>}) => stockApi.updateItem(id, data),
        onSuccess: (item) => {
            queryClient.setQueryData<StockItem[]>(queryKey, (old = []) => old.map(i => i._id === item._id ? item : i));
        },
    });
}

export function useDeleteStockItem(restaurantId: string) {
    const queryClient = useQueryClient();
    const queryKey = ["stock-items", restaurantId];

    return useMutation({
        mutationFn: (id: string) => stockApi.deleteItem(id),
        onSuccess: (_, id) => {
            queryClient.setQueryData<StockItem[]>(queryKey, (old = []) => old.filter(i => i._id !== id));
        },
    });
}

export function useAddStock(restaurantId: string) {
    const queryClient = useQueryClient();
    const queryKey = ["stock-items", restaurantId];

    return useMutation({
        mutationFn: ({id, data}: {id: string; data: {quantity: number; reason?: string}}) => stockApi.addStock(id, data),
        onSuccess: (item) => {
            queryClient.setQueryData<StockItem[]>(queryKey, (old = []) => old.map(i => i._id === item._id ? item : i));
        },
    });
}

export function useRemoveStock(restaurantId: string) {
    const queryClient = useQueryClient();
    const queryKey = ["stock-items", restaurantId];

    return useMutation({
        mutationFn: ({id, data}: {id: string; data: {quantity: number; reason?: string}}) => stockApi.removeStock(id, data),
        onSuccess: (item) => {
            queryClient.setQueryData<StockItem[]>(queryKey, (old = []) => old.map(i => i._id === item._id ? item : i));
        },
    });
}
