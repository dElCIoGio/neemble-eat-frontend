import {Item} from "@/types/item";
import {Menu} from "@/types/menu";
import {Restaurant} from "@/types/restaurant";
import {createContext, useContext} from "react";
import {Category} from "@/types/category";


interface MenuContextProps {
    restaurant: Restaurant;
    menu: Menu;
    open: boolean;
    tableNumber: number;
    setSelectedItem: (item: Item) => void;
    selectedItem: Item | undefined;
    unselectItem: () => void;
    categories: Category[];
}

export const MenuContext = createContext<MenuContextProps | undefined>(undefined);

export function useMenuContext() {
    const context = useContext(MenuContext)
    if (!context)
        throw new Error("useMenuContext() must be used within the MenuContext");
    return context
}