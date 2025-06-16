import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {recipesApi} from "./requests";
import {Recipe, RecipeCreate} from "@/types/stock";

export function useGetRecipes(restaurantId: string) {
    const queryClient = useQueryClient();
    const queryKey = ["recipes", restaurantId];

    const addRecipe = (recipe: Recipe) => {
        queryClient.setQueryData<Recipe[]>(queryKey, (old = []) => [...old, recipe]);
    };
    const removeRecipe = (id: string) => {
        queryClient.setQueryData<Recipe[]>(queryKey, (old = []) => old.filter(r => r._id !== id));
    };
    const updateRecipe = (updated: Recipe) => {
        queryClient.setQueryData<Recipe[]>(queryKey, (old = []) => old.map(r => r._id === updated._id ? updated : r));
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

    return useMutation({
        mutationFn: (data: RecipeCreate) => recipesApi.createRecipe(restaurantId, data),
        onSuccess: (recipe) => {
            queryClient.setQueryData<Recipe[]>(queryKey, (old = []) => [...old, recipe]);
        },
    });
}

export function useUpdateRecipe(restaurantId: string) {
    const queryClient = useQueryClient();
    const queryKey = ["recipes", restaurantId];

    return useMutation({
        mutationFn: ({id, data}: {id: string; data: Partial<Recipe>}) => recipesApi.updateRecipe(id, data),
        onSuccess: (recipe) => {
            queryClient.setQueryData<Recipe[]>(queryKey, (old = []) => old.map(r => r._id === recipe._id ? recipe : r));
        },
    });
}

export function useDeleteRecipe(restaurantId: string) {
    const queryClient = useQueryClient();
    const queryKey = ["recipes", restaurantId];

    return useMutation({
        mutationFn: (id: string) => recipesApi.deleteRecipe(id),
        onSuccess: (_, id) => {
            queryClient.setQueryData<Recipe[]>(queryKey, (old = []) => old.filter(r => r._id !== id));
        },
    });
}
