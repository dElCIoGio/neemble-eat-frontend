import {Restaurant} from "@/types/restaurant";
import {Menu} from "@/types/menu";
import {createContext, useContext} from "react";
import {Outlet, useParams} from "react-router";
import {useGetCurrentMenu, useGetRestaurantBySlug} from "@/api/endpoints/restaurants/hooks";
import {Loader} from "@/components/ui/loader";
import {useGetActiveSessionByTableNumber} from "@/api/endpoints/sessions/hooks";
import {TableSession} from "@/types/table-session";

interface RestaurantMenuContextProps {

    menu: Menu
    restaurant: Restaurant
    session: TableSession

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
        restaurantSlug,
        tableNumber
    } = useParams() as unknown as { restaurantSlug: string , tableNumber: number };

    const {
        data: restaurant,
    } = useGetRestaurantBySlug(restaurantSlug)

    const {
        data: menu,
    } = useGetCurrentMenu(restaurant?._id)

    const {
        data: session
    } = useGetActiveSessionByTableNumber({
        restaurantId: restaurant?._id,
        tableNumber: tableNumber
    })



    if (!menu || !restaurant || !session) return <div>
        <Loader/>
    </div>



    return(
        <RestaurantMenuContext.Provider value={{
            menu,
            restaurant,
            session
        }}>
            <Outlet/>
        </RestaurantMenuContext.Provider>
    )

}
