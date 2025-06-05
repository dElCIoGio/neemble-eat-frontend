import {useQuery, useQueryClient} from "@tanstack/react-query";
import {categoryApi} from "@/api/endpoints/categories/requests";
import {Category} from "@/types/category";


export function useGetRestaurantCategories(restaurantId: string){

    const queryKey = ["restaurant categories", restaurantId]

    const queryClient = useQueryClient();


    const removeCategory = (categoryId: string) => {
        queryClient.setQueryData<Category[]>(queryKey, (oldData) => {
            if (!oldData) return [];
            return oldData.filter(category => category._id !== categoryId);
        });
    };

    const query = useQuery({
        queryKey,
        queryFn: () => categoryApi.getRestaurantCategories(restaurantId)
    })

    return {
        ...query,
        removeCategory,
    }

}


export function useGetMenuCategoriesBySlug(menuSlug: string){

    const queryKey = ["menu categories", menuSlug]

    const queryClient = useQueryClient();

    const removeCategory = (categoryId: string) => {
        queryClient.setQueryData<Category[]>(queryKey, (oldData) => {
            if (!oldData) return [];
            return oldData.filter(category => category._id !== categoryId);
        });
    };

    const {data, ...query} = useQuery({
        queryKey,
        queryFn: () => categoryApi.getMenuCategoriesBySlug(menuSlug),
        enabled: menuSlug != undefined
    })

    return {
        data: data? data: [],
        ...query,
        removeCategory,
    }

}


export function useGetCategoryBySlug(categorySlug: string){

    const queryKey = ["category slug", categorySlug]

    return useQuery({
        queryKey,
        queryFn: () => categoryApi.getCategoryBySlug(categorySlug),
        enabled: categorySlug != undefined
    })

}