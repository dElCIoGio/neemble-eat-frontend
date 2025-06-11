import {createContext, useContext} from "react";
import {QueryObserverResult, RefetchOptions} from "@tanstack/react-query";
import {Order} from "@/types/order";

interface ContextProps {
    orders: Order[] | undefined;
    refreshOrders: (options?: RefetchOptions) => Promise<QueryObserverResult<Order[] | undefined, Error>>;
    isFetchingOrders: boolean;
    customerName: string
}

export const OrdersContext = createContext<ContextProps | undefined>(undefined)


export function useOrdersContext() {
    const context = useContext(OrdersContext)

    if (!context)
        throw new Error("useOrdersContext() must be used within the Context");

    return context

}