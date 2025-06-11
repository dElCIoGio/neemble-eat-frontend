import {Card} from "@/components/ui/card";
import {Tag, QrCode, Clock} from "@phosphor-icons/react"
import {Separator} from "@/components/ui/separator";
import { Order } from "@/types/order";
import timeAgo from "@/lib/helpers/time-calculator";
import {formatCurrency} from "@/lib/helpers/format-currency";
import {useOrdersTrackingContext} from "@/context/orders-tracking-context";
import {OrderBadge} from "@/components/pages/dashboard-orders/order-badge";
import {Cancelled, InProgress, New, Ready} from "@/components/pages/dashboard-orders/order-tag";


interface OrderCardProps {
    order: Order
}


export function OrderListing({order}: OrderCardProps) {

    const time = timeAgo(order.orderTime)
    const price = formatCurrency(order.total)
    const {orderSelected, handleOrderSelected} = useOrdersTrackingContext()

    return (
        <Card onClick={() => handleOrderSelected(order)}
              className={`p-4 w-full rounded-xl  transition-all duration-150 ${orderSelected?._id === order._id ? 'border-amethyst-400 outline outline-amethyst-800 bg-zinc-50' : "hover:bg-zinc-50"}`}>
            <div className="flex justify-between w-full">
                <div className={"w-full"}>
                    <div className="flex items-end space-x-1.5 font-semibold tracking-tight ">
                        <h1 className=" w-fit text-base laptop:text-lg">{order.orderedItemName}</h1> <span className="hidden text-zinc-600 text-base laptop:block">x{order.quantity}</span>
                    </div>
                    <div className="flex laptop:hidden space-x-1.5 items-center text-zinc-600 font-poppins-regular w-full">
                        <h3>Quantidade: </h3>
                        <span className="text-zinc-800 font-poppins-medium">
                            {order.quantity}
                        </span>
                    </div>

                </div>

                <div className="p-2 text-sm">
                    {order.prepStatus === "queued" ? <New/> :
                        order.prepStatus === "in_progress" ? <InProgress/> :
                            order.prepStatus === "cancelled" ? <Cancelled/> :
                                <Ready/>}
                </div>
            </div>
            <Separator className="block laptop:hidden my-3"/>
            <div>
                <div className='hidden laptop:flex items-center space-x-2'>
                    <OrderBadge icon={QrCode}>
                        Mesa {order.tableNumber}
                    </OrderBadge>
                    <OrderBadge icon={Clock}>
                        {time} atrás
                    </OrderBadge>
                    <OrderBadge icon={Tag}>
                        Kz {price}
                    </OrderBadge>
                </div>
                <div className={"laptop:hidden"}>
                    <div className="flex space-x-1.5 items-center text-zinc-600 font-poppins-regular">
                        <QrCode/>
                        <h3>Mesa: <span className="text-zinc-800 font-poppins-medium">{order.tableNumber}</span></h3>
                    </div>
                    <div className="flex space-x-1.5 items-center text-zinc-600 font-poppins-regular">
                        <Clock/>
                        <h3>Tempo: <span className="text-zinc-800 font-poppins-medium">{time} atrás</span></h3>
                    </div>
                    <div className="flex space-x-1.5 items-center text-zinc-600 font-poppins-regular">
                        <Tag/>
                        <h3>Preço: <span className="text-zinc-800 font-poppins-medium">Kz {price}</span></h3>
                    </div>

                </div>
            </div>


        </Card>
    );
}

