import {Separator} from "@/components/ui/separator";
import {X} from "lucide-react"
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {useOrdersTrackingContext} from "@/context/orders-tracking-context";
import {formatCurrency} from "@/lib/helpers/format-currency";
import {Order, OrderPrepStatus} from "@/types/order";
import {showPromiseToast} from "@/utils/notifications/toast";
import {ordersApi} from "@/api/endpoints/orders/requests";
import {New, InProgress, Ready, Cancelled} from "@/components/pages/dashboard-orders/order-tag";



interface OrderInfoProps {
    order: Order
}

export function OrderInfo({order}: OrderInfoProps) {

    const { handleOrderDeselected, updateOrderStatus } = useOrdersTrackingContext()
    const Time = new Date(order.orderTime)
    const price = formatCurrency(order.total)


    function formatNumberToTwoDigits(number: number): string {
        return number < 10 ? `0${number}` : `${number}`
    }

    function formatTime(time: Date) {
        return `${formatNumberToTwoDigits(time.getHours())}:${formatNumberToTwoDigits(time.getMinutes())}`
    }

    function update(status: OrderPrepStatus) {

        showPromiseToast(
            ordersApi.updateOrderStatus(order._id, status).then(() => {
                updateOrderStatus(order._id, status)
            }),
            {
                loading: "Atualizado...",
                success: "Pedido atualizado com sucesso",
                error: "Houve uma falha ao atualizar o pedido. Tente novamente."
            }
        );
    }

    return (
        <div className={`p-6 h-full`}>
            <div className="flex justify-end">
                <Button size={"icon"} variant="ghost" className="h-8 w-8" onClick={() => handleOrderDeselected()}>
                    <X className="h-8 w-8 p-0"/>
                </Button>
            </div>
            <div className="mt-3">
                {
                    order.prepStatus === "queued" ? <New/> :
                        order.prepStatus === "in_progress" ? <InProgress/> :
                            order.prepStatus === "cancelled" ? <Cancelled/> :
                                <Ready/>
                }
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
                {order.orderedItemName}
            </h1>
            <Separator className="my-4"/>
            <div className="w-full space-y-1.5">
                <div className="w-full flex justify-between">
                    <h1 className="font-poppins-regular text-zinc-500">
                        Mesa
                    </h1>
                    <span className="font-poppins-semibold text-amethyst-300">
                        {order.tableNumber}
                    </span>
                </div>
                <div className="w-full flex justify-between">
                    <h1 className="font-poppins-regular text-zinc-500">
                        Hora
                    </h1>
                    <span className="font-poppins-semibold text-amethyst-300">
                        {formatTime(Time)}
                    </span>
                </div>
                <div className="w-full flex justify-between">
                    <h1 className="font-poppins-regular text-zinc-500">
                        Total
                    </h1>
                    <span className="font-poppins-semibold text-amethyst-300">
                        Kz {price}
                    </span>
                </div>
            </div>
            {
                order.additionalNote != undefined && order.additionalNote != "" &&
                <div>
                    <Separator className="my-4"/>
                    <div>
                        <h1 className="font-poppins-regular text-zinc-500">
                            Nota do Cliente:
                        </h1>
                        <Card className="p-4 bg-zinc-100 rounded-2xl my-2 border-amethyst-300">
                            <p className="text-sm font-poppins-regular text-zinc-800">
                                {order.additionalNote}
                            </p>
                        </Card>
                    </div>
                </div>
            }
            <Separator className="my-4"/>
            <div className="mb-12 laptop:mb-0">
                <h1 className="font-poppins-semibold text-zinc-500 my-2">
                    Ações
                </h1>
                {
                    order.prepStatus === "queued" ?
                        <div className="flex space-x-2">
                            <Button
                                className="w-1/2"
                                variant={"default"}
                                type={"button"}
                                onClick={() => update("in_progress" as OrderPrepStatus)}>
                                Em Preparo
                            </Button>
                            <Button
                                className="w-1/2"
                                variant={"destructive"}
                                type={"button"}
                                onClick={() => update("cancelled" as OrderPrepStatus)}>
                                Cancelar Pedido
                            </Button>
                        </div>:
                        order.prepStatus === "in_progress" ?
                            <div className="flex space-x-2">
                                <Button
                                    className="w-1/2"
                                    variant="default"
                                    type="button"
                                    onClick={() => update("ready" as OrderPrepStatus)}>
                                    Prato Pronto
                                </Button>
                                <Button
                                    className="w-1/2"
                                    variant={"destructive"}
                                    type={"button"}
                                    onClick={() => update("cancelled" as OrderPrepStatus)}>
                                    Cancelar Pedido
                                </Button>
                            </div>:
                            order.prepStatus === "cancelled" || order.prepStatus === "ready" &&
                            <div className="space-x-2">

                            </div>
                }
            </div>
        </div>
    );
}
