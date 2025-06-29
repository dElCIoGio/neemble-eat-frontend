import {useOrdersTrackingContext} from "@/context/orders-tracking-context";
import {OrderListing} from "@/components/pages/dashboard-orders/order-listing";


export function OrdersDisplay() {

    const {orders, filterMode, tableFilter, sorting} = useOrdersTrackingContext()

    const filteredOrders = orders.filter((order) => {
        console.log("FILTERING ORDERS:")
        console.log(order)
        const matchesFilterMode = filterMode.tag === 'all' || filterMode.tag === order.prepStatus;
        const matchesTableFilter = tableFilter === "all" || tableFilter === null || tableFilter === (order.tableNumber?.toString() ?? null);
        return matchesFilterMode && matchesTableFilter;
    }).sort((a, b) => {
        const timeA = new Date(a.orderTime).getTime();
        const timeB = new Date(b.orderTime).getTime();

        if (sorting === "asc") {
            return timeA - timeB;
        } else {
            return timeB - timeA;
        }
    });

    return (
        <div className={`space-y-1.5 p-1`}>
            {
                filteredOrders.map(order => (
                    <OrderListing key={order._id} order={order}/>
                ))
            }
        </div>
    );
}

