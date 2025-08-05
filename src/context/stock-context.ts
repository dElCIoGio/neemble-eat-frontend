import {createContext, useContext} from "react";
import {StockItem, Recipe} from "@/types/stock";

export interface StockContextProps {
    stockItems: StockItem[];
    recipes: Recipe[];
}

export const StockContext = createContext<StockContextProps | undefined>(undefined);

export function useStockContext() {
    const context = useContext(StockContext);
    if (!context) throw new Error("useStockContext must be used within the StockContext.Provider");
    return context;
}

