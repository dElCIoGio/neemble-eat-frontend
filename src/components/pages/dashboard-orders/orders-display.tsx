import {useOrdersTrackingContext} from "@/context/orders-tracking-context";
import {OrderListing} from "@/components/pages/dashboard-orders/order-listing";
import { toDateTime } from "@/utils/time";


export function OrdersDisplay() {

    const {orders, activeFilters, tableFilter, sorting, viewMode, orderSelected} = useOrdersTrackingContext()

    const filteredOrders = orders.filter((order) => {
        const matchesFilterMode = activeFilters.length === 0 || activeFilters.includes(order.prepStatus);
        const matchesTableFilter = tableFilter === "all" || tableFilter === null || tableFilter === (order.tableNumber?.toString() ?? null);
        return matchesFilterMode && matchesTableFilter;
    }).sort((a, b) => {
        const timeA = toDateTime(a.orderTime).toMillis();
        const timeB = toDateTime(b.orderTime).toMillis();

        if (sorting === "asc") {
            return timeA - timeB;
        } else {
            return timeB - timeA;
        }
    });

    return (
        <div className={`p-1 ${viewMode === 'grid' ? `grid grid-cols-1 sm:grid-cols-2 ${orderSelected? "lg:grid-cols-2":"lg:grid-cols-3"} gap-1.5` : 'space-y-1.5'}`}>
            {
                filteredOrders.map(order => (
                    <OrderListing key={order._id} order={order} viewMode={viewMode}/>
                ))
            }
        </div>
    );
}

