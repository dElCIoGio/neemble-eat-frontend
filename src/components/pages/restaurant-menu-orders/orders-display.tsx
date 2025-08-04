import {useOrdersContext} from "@/context/order-context";
import {OrderSingleItem} from "@/components/pages/restaurant-menu-orders/order-single-item";
import {Cancelled, InProgress, Ready, Queued} from "@/components/pages/restaurant-menu-orders/order-status";


export function OrdersDisplay() {

    const {orders} = useOrdersContext()

    return (
        <div className='bg-white shadow-sm p-2 rounded-3xl mt-3 border border-gray-200'>
            {
                orders &&
                orders.map((order, index) => (
                    <div key={index}
                         className='item m-2'>
                        <OrderSingleItem order={order}/>
                        <div className='my-2'>
                            {
                                order.prepStatus == "ready" ?
                                    <Ready/> :
                                    order.prepStatus == "cancelled" ?
                                        <Cancelled/> :
                                        order.prepStatus == "queued" ? <Queued/> :
                                        <InProgress/>
                            }
                        </div>
                    </div>
                ))
            }
        </div>

    );
}

