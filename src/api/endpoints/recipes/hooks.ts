import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {recipesApi} from "./requests";
import {recipesClient} from "@/api";
import {Recipe, RecipeCreate} from "@/types/stock";

type PaginatedResponse<T> = {
    items: T[];
    nextCursor: string | null;
    totalCount: number;
    hasMore: boolean;
};

export function useGetRecipes(restaurantId: string) {
    const queryClient = useQueryClient();
    const queryKey = ["recipes", restaurantId];
    const paginatedKey = ["paginated", recipesClient.defaults.baseURL];

    const addRecipe = (recipe: Recipe) => {
        queryClient.setQueryData<Recipe[]>(queryKey, (old = []) => [...old, recipe]);
        queryClient.setQueriesData<PaginatedResponse<Recipe>>({queryKey: paginatedKey}, (old) =>
            old ? {
                ...old,
                items: [recipe, ...old.items],
                totalCount: (old.totalCount ?? 0) + 1,
            } : old
        );
    };
    const removeRecipe = (id: string) => {
        queryClient.setQueryData<Recipe[]>(queryKey, (old = []) => old.filter(r => r._id !== id));
        queryClient.setQueriesData<PaginatedResponse<Recipe>>({queryKey: paginatedKey}, (old) =>
            old ? {
                ...old,
                items: old.items.filter(r => r._id !== id),
                totalCount: Math.max(0, (old.totalCount ?? 0) - 1),
            } : old
        );
    };
    const updateRecipe = (updated: Recipe) => {
        queryClient.setQueryData<Recipe[]>(queryKey, (old = []) => old.map(r => r._id === updated._id ? updated : r));
        queryClient.setQueriesData<PaginatedResponse<Recipe>>({queryKey: paginatedKey}, (old) =>
            old ? {
                ...old,
                items: old.items.map(r => r._id === updated._id ? updated : r),
            } : old
        );
    };

    const query = useQuery({
        queryKey,
        queryFn: () => recipesApi.listRecipes(restaurantId),
        enabled: !!restaurantId,
    });

    return { ...query, addRecipe, removeRecipe, updateRecipe };
}

export function useCreateRecipe(restaurantId: string) {
    const queryClient = useQueryClient();
    const queryKey = ["recipes", restaurantId];
    const paginatedKey = ["paginated", recipesClient.defaults.baseURL];

    return useMutation({
        mutationFn: (data: RecipeCreate) => recipesApi.createRecipe(restaurantId, data),
        onSuccess: (recipe) => {
            queryClient.setQueryData<Recipe[]>(queryKey, (old = []) => [...old, recipe]);
            queryClient.setQueriesData<PaginatedResponse<Recipe>>({queryKey: paginatedKey}, (old) =>
                old ? {
                    ...old,
                    items: [recipe, ...old.items],
                    totalCount: (old.totalCount ?? 0) + 1,
                } : old
            );
        },
    });
}

export function useUpdateRecipe(restaurantId: string) {
    const queryClient = useQueryClient();
    const queryKey = ["recipes", restaurantId];
    const paginatedKey = ["paginated", recipesClient.defaults.baseURL];

    return useMutation({
        mutationFn: ({id, data}: {id: string; data: Partial<Recipe>}) => recipesApi.updateRecipe(id, data),
        onSuccess: (recipe) => {
            queryClient.setQueryData<Recipe[]>(queryKey, (old = []) => old.map(r => r._id === recipe._id ? recipe : r));
            queryClient.setQueriesData<PaginatedResponse<Recipe>>({queryKey: paginatedKey}, (old) =>
                old ? {
                    ...old,
                    items: old.items.map(r => r._id === recipe._id ? recipe : r),
                } : old
            );
        },
    });
}

export function useDeleteRecipe(restaurantId: string) {
    const queryClient = useQueryClient();
    const queryKey = ["recipes", restaurantId];
    const paginatedKey = ["paginated", recipesClient.defaults.baseURL];

    return useMutation({
        mutationFn: (id: string) => recipesApi.deleteRecipe(id),
        onSuccess: (_, id) => {
            queryClient.setQueryData<Recipe[]>(queryKey, (old = []) => old.filter(r => r._id !== id));
            queryClient.setQueriesData<PaginatedResponse<Recipe>>({queryKey: paginatedKey}, (old) =>
                old ? {
                    ...old,
                    items: old.items.filter(r => r._id !== id),
                    totalCount: Math.max(0, (old.totalCount ?? 0) - 1),
                } : old
            );
        },
    });
}
