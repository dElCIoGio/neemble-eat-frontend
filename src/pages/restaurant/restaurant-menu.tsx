import { MenuContext } from "@/context/menu-context";
import {useGetCurrentMenu, useGetRestaurantBySlug} from "@/api/endpoints/restaurants/hooks";
import {useParams, useSearchParams} from "react-router";
import Navbar from "@/components/pages/restaurant-menu/navbar";
import {Banner} from "@/components/pages/restaurant-menu/banner";
import {RestaurantInfo} from "@/components/pages/restaurant-menu/restaurant-info";
import {TableInfo} from "@/components/pages/restaurant-menu/table-info";
import {Footer} from "@/components/pages/restaurant-menu/footer";
import FloatingCartButton from "@/components/pages/restaurant-menu/floating-button";
import {Categories} from "@/components/pages/restaurant-menu/categories";
import {useState} from "react";
import {Item} from "@/types/item";
import {useGetMenuCategories} from "@/api/endpoints/menu/hooks";
import {Loader} from "@/components/ui/loader";
import {isRestaurantOpen} from "@/utils/restaurant/is-restaurant-open";

function RestaurantMenu() {


    const [, setSearchParams] = useSearchParams();

    const [selectedItem, setSelectedItem] = useState<Item | undefined>()

    const {
        restaurantSlug,
        tableNumber
    } = useParams() as unknown as { restaurantSlug: string , tableNumber: number };

    const {
        data: restaurant,
        isLoading: isRestaurantLoading
    } = useGetRestaurantBySlug(restaurantSlug)

    const {
        data: menu,
        isLoading: isMenuLoading
    } = useGetCurrentMenu(restaurant?._id)

    const {
        data: categories = []
    } = useGetMenuCategories(menu?._id)

    console.log(restaurant)

    function selectItem(item: Item) {
        setSelectedItem(item)
        if (item._id) {
            setUrlVariable("item", item._id)
            setUrlVariable("category", item.categoryId)
        }
    }

    const setUrlVariable = (key: string, value: string) => {
        setSearchParams(prevParams => {
            prevParams.set(key, value);
            return prevParams;
        });
    }

    function unselectItem() {
        setSearchParams(prevParams => {
            const newParams = new URLSearchParams(prevParams.toString());
            newParams.delete("item");
            newParams.delete("category");
            return newParams;
        });
    }

    document.title = restaurant ? `Menu | ${restaurant.name}` : "Carregando"

    if (isMenuLoading || isRestaurantLoading) {
        return <div className="flex-1 justify-center items-center">
            <Loader/>
        </div>
    }


    return (
        <div className="font-poppins h-dvh flex flex-1 flex-col">
            {menu && restaurant &&
                <MenuContext.Provider
                    value={{
                        menu,
                        restaurant,
                        open: isRestaurantOpen(restaurant),
                        tableNumber,
                        setSelectedItem: selectItem,
                        selectedItem,
                        unselectItem,
                        categories
                    }}>
                    <div>
                        <Navbar/>
                        <Banner/>
                        <div className="flex-1">
                            <div className={"px-4"}>
                                <RestaurantInfo/>
                                <TableInfo/>
                            </div>
                            <Categories/>
                        </div>
                        <Footer/>
                        <FloatingCartButton/>
                    </div>
                </MenuContext.Provider>
            }
        </div>
    );
}

export default RestaurantMenu;