import React, {createContext, useContext} from "react";
import {CartItem} from "@/lib/helpers/cart";

interface CartContextProps {
    customerName: string;
    setCustomerName: React.Dispatch<React.SetStateAction<string>>;
    cart: CartItem[];
    numberOfItems: number;
    totalValue: number;
    iSFetchingSession: boolean;

    findCartItemIndexByID: (id: string) => number;
    incrementProduct: (index: number) => (CartItem | null);
    deleteProduct: (index: number) => (0 | 1);
    decrementProduct: (index: number) => (CartItem | null)
}

export const CartContext = createContext<CartContextProps | undefined>(undefined);


export function useCartContext() {
    const context = useContext(CartContext)

    if (!context)
        throw new Error("useCartContext() must be used within the Context");

    return context;
}