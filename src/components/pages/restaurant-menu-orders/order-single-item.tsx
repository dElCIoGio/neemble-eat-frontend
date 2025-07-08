import {formatDateString} from "@/lib/helpers/format-date-string";
import {Order} from "@/types/order";
import {ChevronDown} from "lucide-react";
import {useState} from "react";

interface Props {
    order: Order
}

export function OrderSingleItem({order}: Props) {
    const {day, month, time} = formatDateString(order.orderTime)
    const [expanded, setExpanded] = useState(false)


    return (
        <div className='text-sm cursor-pointer' onClick={() => setExpanded(!expanded)}>
            <div className='flex justify-between items-center'>
                <div className='flex'>
                    <p className='font-semibold'>Pedido:&nbsp;</p>
                    <p className='truncate hover:overflow-clip w-32'>
                        {order.orderedItemName}
                    </p>
                    <p>
                        x {order.quantity}
                    </p>
                </div>
                <ChevronDown size={16} className={`ml-2 transition-transform ${expanded ? "rotate-180" : ""}`}/>
            </div>
            <p className='text-sm text-gray-400'>
                {`${day} de ${month} | ${time}`}
            </p>
            <div className='text-sm'>
                <div className='flex'>

                    <p className={`font-semibold ${order.prepStatus == "cancelled" && "line-through italic"}`}>
                        {order.unitPrice * order.quantity}.00
                    </p>
                    <p>&nbsp;Kz</p>
                </div>
            </div>
            {expanded && (
                <div className='mt-1 text-xs text-gray-600 space-y-1'>
                    <p>Mesa: {order.tableNumber}</p>
                    {order.additionalNote && <p>Nota: {order.additionalNote}</p>}
                    {order.customisations && order.customisations.length > 0 && (
                        <div className='space-y-0.5'>
                            <p className='font-medium'>Personalizações:</p>
                            {order.customisations.map((c) => (
                                <p key={c.ruleName}>
                                    <span className='font-medium'>{c.ruleName}: </span>
                                    {c.selectedOptions.map(o => `${o.optionName} (${o.quantity})`).join(', ')}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>

    );}