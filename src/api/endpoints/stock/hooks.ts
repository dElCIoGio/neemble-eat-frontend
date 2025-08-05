import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {stockApi} from "@/api/endpoints/stock/requests";
import {stockItemClient} from "@/api";
import {StockItem, StockItemCreate} from "@/types/stock";

type PaginatedResponse<T> = {
    items: T[];
    nextCursor: string | null;
    totalCount: number;
    hasMore: boolean;
};

export function useGetStockItems(restaurantId: string) {
    const queryClient = useQueryClient();
    const queryKey = ["stock-items", restaurantId];
    const paginatedKey = ["paginated", stockItemClient.defaults.baseURL, `/restaurant/${restaurantId}/paginate`];

    const addItem = (item: StockItem) => {
        queryClient.setQueryData<StockItem[]>(queryKey, (old = []) => [...old, item]);
        queryClient.setQueriesData<PaginatedResponse<StockItem>>({queryKey: paginatedKey}, (old) =>
            old ? {
                ...old,
                items: [item, ...old.items],
                totalCount: (old.totalCount ?? 0) + 1,
            } : old
        );
    };
    const removeItem = (id: string) => {
        queryClient.setQueryData<StockItem[]>(queryKey, (old = []) => old.filter(i => i._id !== id));
        queryClient.setQueriesData<PaginatedResponse<StockItem>>({queryKey: paginatedKey}, (old) =>
            old ? {
                ...old,
                items: old.items.filter(i => i._id !== id),
                totalCount: Math.max(0, (old.totalCount ?? 0) - 1),
            } : old
        );
    };
    const updateItem = (updated: StockItem) => {
        queryClient.setQueryData<StockItem[]>(queryKey, (old = []) => old.map(i => i._id === updated._id ? updated : i));
        queryClient.setQueriesData<PaginatedResponse<StockItem>>({queryKey: paginatedKey}, (old) =>
            old ? {
                ...old,
                items: old.items.map(i => i._id === updated._id ? updated : i),
            } : old
        );
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
    const paginatedKey = ["paginated", stockItemClient.defaults.baseURL, `/restaurant/${restaurantId}/paginate`];

    return useMutation({
        mutationFn: (data: StockItemCreate) => stockApi.createItem(restaurantId, data),
        onSuccess: (item) => {
            queryClient.setQueryData<StockItem[]>(queryKey, (old = []) => [...old, item]);
            queryClient.setQueriesData<PaginatedResponse<StockItem>>({queryKey: paginatedKey}, (old) =>
                old ? {
                    ...old,
                    items: [item, ...old.items],
                    totalCount: (old.totalCount ?? 0) + 1,
                } : old
            );
        },
    });
}

export function useUpdateStockItem(restaurantId: string) {
    const queryClient = useQueryClient();
    const queryKey = ["stock-items", restaurantId];
    const paginatedKey = ["paginated", stockItemClient.defaults.baseURL, `/restaurant/${restaurantId}/paginate`];

    return useMutation({
        mutationFn: ({id, data}: {id: string; data: Partial<StockItem>}) => stockApi.updateItem(id, data),
        onSuccess: (item) => {
            queryClient.setQueryData<StockItem[]>(queryKey, (old = []) => old.map(i => i._id === item._id ? item : i));
            queryClient.setQueriesData<PaginatedResponse<StockItem>>({queryKey: paginatedKey}, (old) =>
                old ? {
                    ...old,
                    items: old.items.map(i => i._id === item._id ? item : i),
                } : old
            );
        },
    });
}

export function useDeleteStockItem(restaurantId: string) {
    const queryClient = useQueryClient();
    const queryKey = ["stock-items", restaurantId];
    const paginatedKey = ["paginated", stockItemClient.defaults.baseURL, `/restaurant/${restaurantId}/paginate`];

    return useMutation({
        mutationFn: (id: string) => stockApi.deleteItem(id),
        onSuccess: (_, id) => {
            queryClient.setQueryData<StockItem[]>(queryKey, (old = []) => old.filter(i => i._id !== id));
            queryClient.setQueriesData<PaginatedResponse<StockItem>>({queryKey: paginatedKey}, (old) =>
                old ? {
                    ...old,
                    items: old.items.filter(i => i._id !== id),
                    totalCount: Math.max(0, (old.totalCount ?? 0) - 1),
                } : old
            );
        },
    });
}

export function useAddStock(restaurantId: string) {
    const queryClient = useQueryClient();
    const queryKey = ["stock-items", restaurantId];
    const paginatedKey = ["paginated", stockItemClient.defaults.baseURL, `/restaurant/${restaurantId}/paginate`];

    return useMutation({
        mutationFn: ({id, data}: {id: string; data: {quantity: number; reason?: string}}) => stockApi.addStock(id, data),
        onSuccess: (item) => {
            queryClient.setQueryData<StockItem[]>(queryKey, (old = []) => old.map(i => i._id === item._id ? item : i));
            queryClient.setQueriesData<PaginatedResponse<StockItem>>({queryKey: paginatedKey}, (old) =>
                old ? {
                    ...old,
                    items: old.items.map(i => i._id === item._id ? item : i),
                } : old
            );
        },
    });
}

export function useRemoveStock(restaurantId: string) {
    const queryClient = useQueryClient();
    const queryKey = ["stock-items", restaurantId];
    const paginatedKey = ["paginated", stockItemClient.defaults.baseURL, `/restaurant/${restaurantId}/paginate`];

    return useMutation({
        mutationFn: ({id, data}: {id: string; data: {quantity: number; reason?: string}}) => stockApi.removeStock(id, data),
        onSuccess: (item) => {
            queryClient.setQueryData<StockItem[]>(queryKey, (old = []) => old.map(i => i._id === item._id ? item : i));
            queryClient.setQueriesData<PaginatedResponse<StockItem>>({queryKey: paginatedKey}, (old) =>
                old ? {
                    ...old,
                    items: old.items.map(i => i._id === item._id ? item : i),
                } : old
            );
        },
    });
}
