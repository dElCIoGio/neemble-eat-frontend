import {formatDateString} from "@/lib/helpers/format-date-string";
import {Order} from "@/types/order";

interface Props {
    order: Order
}

export function OrderSingleItem({order}: Props) {

    const {day, month, time} = formatDateString(order.orderTime)


    return (
        <div className='flex justify-between items-center text-sm'>
            <div>
                <div className='flex'>
                    <p className='font-semibold'>Pedido:&nbsp;</p>
                    <p className='truncate hover:overflow-clip w-32'>
                        {order.orderedItemName}
                    </p>
                    <p>
                        x {order.quantity}
                    </p>
                </div>
                <p className='text-sm text-gray-400'>
                    {`${day} de ${month} | ${time}`}
                </p>
            </div>
            <div className='text-sm'>
                <div className='flex'>

                    <p className={`font-semibold ${order.prepStatus == "cancelled" && "line-through italic"}`}>
                        {order.unitPrice * order.quantity}.00
                    </p>
                    <p>&nbsp;Kz</p>
                </div>
            </div>
        </div>

    );
}