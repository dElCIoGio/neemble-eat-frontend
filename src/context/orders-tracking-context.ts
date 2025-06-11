import {createContext, useContext} from "react";
import {Order} from "@/types/order";
import {Filter} from "@/pages/dashboard/order-tracking";


interface OrdersTrackingContextProps {
    orderSelected: Order | null;
    handleOrderSelected: (order: Order) => void;
    handleOrderDeselected: () => void;
    orders: Order[]
    filterMode: Filter,
    handleFilterModeChange: (filterMode: Filter) => void
    tableFilter: string | null,
    handleTableFilterChange: (tableFilter: string | null) => void,
    updateOrderStatus: (orderId: string, newStatus: string) => void
    sorting: "asc" | "desc"
    handleSortingChange: (order: "asc" | "desc") => void
}

export const OrdersTrackingContext = createContext<OrdersTrackingContextProps | undefined>(undefined)

export function useOrdersTrackingContext() {

    const context = useContext(OrdersTrackingContext)

    if (!context)
        throw new Error('useOrdersTrackingContext must be used within a OrdersTrackingProvider')

    return context
}