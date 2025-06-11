import {Restaurant} from "@/types/restaurant";
import {Menu} from "@/types/menu";
import {createContext, useContext} from "react";
import {Outlet, useParams} from "react-router";
import {useGetCurrentMenu, useGetRestaurantBySlug} from "@/api/endpoints/restaurants/hooks";
import {Loader} from "@/components/ui/loader";

interface RestaurantMenuContextProps {

    menu: Menu
    restaurant: Restaurant

}

export const RestaurantMenuContext = createContext<RestaurantMenuContextProps | undefined>(undefined)

export function useRestaurantMenuContext() {

    const context = useContext(RestaurantMenuContext)

    if (!context) {
        throw new Error('useRestaurantMenuContext must be used within the RestaurantMenuContext');
    }

    return context

}


export function RestaurantMenuProvider(){


    const {
        restaurantSlug
    } = useParams() as unknown as { restaurantSlug: string , tableNumber: number };

    const {
        data: restaurant,
    } = useGetRestaurantBySlug(restaurantSlug)

    const {
        data: menu,
    } = useGetCurrentMenu(restaurant?._id)

    if (!menu || !restaurant) return <div>
        <Loader/>
    </div>

    return(
        <RestaurantMenuContext value={{
            menu,
            restaurant
        }}>
            <Outlet/>
        </RestaurantMenuContext>
    )

}
