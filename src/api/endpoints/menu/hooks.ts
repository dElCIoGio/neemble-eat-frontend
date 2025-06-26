import {useQuery, useQueryClient} from "@tanstack/react-query";
import {menuApi} from "@/api/endpoints/menu/requests";
import {Menu} from "@/types/menu";
import {Item} from "@/types/item";


export function useGetRestaurantMenus(restaurantId: string){

    const queryKey = ["restaurant menus", restaurantId]

    const queryClient = useQueryClient();

    const removeMenu = (menuId: string) => {
        queryClient.setQueryData<Menu[]>(queryKey, (oldData) => {
            if (!oldData) return []
            return oldData.filter(menu => menu._id !== menuId)
        })
    }

    const setMenuActive = (menuId: string, isActive: boolean) => {
        queryClient.setQueryData<Menu[]>(queryKey, (oldData) => {
            if (!oldData) return []
            return oldData.map(menu =>
                menu._id === menuId ? { ...menu, isActive } : menu
            )
        })
    }

    return {
        ...useQuery({
            queryKey,
            queryFn: () => menuApi.getRestaurantMenus(restaurantId)
        }),
        removeMenu,
        setMenuActive,
    }
}

export function useGetMenuBySlug(slug: string) {
    const queryKey = ["menu slug", slug]

    const queryClient = useQueryClient()

    // Hook return can include the updater
    const updateMenu = (updatedFields: Partial<Menu>) => {
        queryClient.setQueryData<Menu>(queryKey, (oldData) => {
            if (!oldData) return oldData
            return {
                ...oldData,
                ...updatedFields,
            }
        })
    }

    const query = useQuery({
        queryKey,
        queryFn: () => menuApi.getMenuBySlug(slug),
        enabled: slug != undefined && slug.trim() != ""
    })

    return {
        ...query,
        updateMenu,
    }
}


export function useGetMenuItemsBySlug(menuSlug: string){

    const queryKey = ["menu items", menuSlug]

    const queryClient = useQueryClient();

    const removeItem = (menuSlug: string) => {
        queryClient.setQueryData<Item[]>(queryKey, (oldData) => {
            if (!oldData) return [];
            return oldData.filter(item => item._id !== menuSlug);
        });
    };

    const {data, ...query} = useQuery({
        queryKey,
        queryFn: () => menuApi.getMenuItemsBySlug(menuSlug),
        enabled: menuSlug != undefined
    })

    return {
        data: data? data: [],
        ...query,
        removeItem,
    }
}


export function useGetMenuCategories(menuId: string | undefined) {

    const queryKey = ["menu", "categories", menuId]

    return useQuery({
        queryKey,
        queryFn: () => typeof menuId == "undefined"? undefined: menuApi.getMenuCategories(menuId),
        enabled: typeof menuId == "string"
    })

}