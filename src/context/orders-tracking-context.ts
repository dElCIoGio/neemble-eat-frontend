import {createContext, useContext} from "react";
import {Order, OrderPrepStatus} from "@/types/order";


interface OrdersTrackingContextProps {
    orderSelected: Order | null;
    handleOrderSelected: (order: Order) => void;
    handleOrderDeselected: () => void;
    orders: Order[]
    activeFilters: OrderPrepStatus[],
    toggleFilter: (status: OrderPrepStatus) => void,
    clearFilters: () => void,
    tableFilter: string | null,
    handleTableFilterChange: (tableFilter: string | null) => void,
    updateOrderStatus: (orderId: string, newStatus: string) => void
    sorting: "asc" | "desc"
    handleSortingChange: (order: "asc" | "desc") => void
    viewMode: "list" | "grid"
    setViewMode: (mode: "list" | "grid") => void
}

export const OrdersTrackingContext = createContext<OrdersTrackingContextProps | undefined>(undefined)

export function useOrdersTrackingContext() {

    const context = useContext(OrdersTrackingContext)

    if (!context)
        throw new Error('useOrdersTrackingContext must be used within a OrdersTrackingProvider')

    return context
}