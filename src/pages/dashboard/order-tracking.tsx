import {useCallback} from "react";
import Background from "@/components/ui/background";
import {ScrollArea} from "@/components/ui/scroll-area";
import {BowlFood} from "@phosphor-icons/react";
import {useIsMobile} from "@/hooks/use-mobile";
import config from "@/config";
import {Order, OrderPrepStatus} from "@/types/order";
import {useSelectedState} from "@/hooks/use-selected-state";
import {useDashboardContext} from "@/context/dashboard-context";
import useWebSocket from "@/hooks/use-web-socket";
import {useGetRecentOrders} from "@/api/endpoints/orders/hooks";
import {Loader} from "@/components/ui/loader";
import { OrdersTrackingContext } from "@/context/orders-tracking-context";
import {Header} from "@/components/pages/dashboard-orders/header";
import {OrdersDisplay} from "@/components/pages/dashboard-orders/orders-display";
import {OrderInfo} from "@/components/pages/dashboard-orders/order-info";
import {MobileOrderInfo} from "@/components/pages/dashboard-orders/mobile-order-info";




export type Tag = "All" | "New" | "In Progress" | "Done" | "Cancelled"

export interface Filter {
    name: string;
    tag: OrderPrepStatus | "all";
}

export const FILTERS: Filter[] = [
    {name: "Todos", tag: "all"},
    {name: "Novos", tag: "queued"},
    {name: "Em preparo", tag: "in_progress"},
    {name: "Prontos", tag: "ready"},
    {name: "Cancelados", tag: "cancelled"},
]



export function OrdersTracking() {

    const isDesktop = !useIsMobile()

    const {api} = config

    document.title = "Gestão de Pedidos"

    const { restaurant } = useDashboardContext()

    const newOrdersWsUrl = `${api.apiUrl.replace("http", "ws")}/ws/${restaurant._id}/order`;
    const billedOrdersWsUrl = `${api.apiUrl.replace("http", "ws")}/ws/${restaurant._id}/billed`;

    const {state: filterMode, handleState: setFilterMode} = useSelectedState<Filter>(FILTERS[0])
    const {state: tableFilter, handleState: handleTableFilterChange} = useSelectedState<string | null>(null)
    const {state: orderSelected, handleState} = useSelectedState<Order | null>(null)
    const {state: sorting, handleState: handleSortingChange} = useSelectedState<"asc" | "desc">("desc")

    const { data: orders, addOrder, removeOrders, updateOrderStatus, isLoading } = useGetRecentOrders(restaurant._id)

    const handleMessageNewOrder = useCallback((event: MessageEvent) => {
        try {
            const order = JSON.parse(event.data);
            addOrder(order);
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    }, [addOrder]);

    const handleFilterModeChange = useCallback((filterMode: Filter) => {
        setFilterMode(filterMode);
    }, [setFilterMode]);

    const handleMessageBilledOrder = useCallback((event: MessageEvent) => {
        const billedOrders: Order[] = JSON.parse(event.data);
        const billedOrdersIDs = billedOrders.map((order) => order._id);
        removeOrders(billedOrdersIDs);
    }, [removeOrders]);

    useWebSocket(
        newOrdersWsUrl, {
            onMessage: handleMessageNewOrder,
            reconnectInterval: 2000,
        }
    )


    useWebSocket(
        billedOrdersWsUrl, {
            onMessage: handleMessageBilledOrder,
            reconnectInterval: 2000,
        }
    )


    if (isLoading){
        return <div className="h-dvh justify-center items-center">
            <Loader/>
        </div>
    }


    return (
        <div className="flex-1 flex-col flex max-h-dvh">
            {
                orders != undefined &&
                <div className="flex-1 flex-col flex">
                    <Background className=""/>
                    {
                        orders &&
                        <OrdersTrackingContext.Provider value={{
                            orders,
                            filterMode,
                            handleFilterModeChange,
                            orderSelected,
                            handleOrderSelected: (order) => handleState(order),
                            handleOrderDeselected: () => handleState(null),
                            tableFilter,
                            handleTableFilterChange,
                            updateOrderStatus,
                            sorting,
                            handleSortingChange
                        }}>
                            <div className="lg:flex lg:flex-col flex-1">
                                <div className="mt-4 mb-8 flex space-x-1.5 items-center">
                                    <div
                                        className="w-8 h-8 rounded-full bg-zinc-50 border border-zinc-300 flex justify-center items-center">
                                        <BowlFood className="w-6 h-6 text-zinc-800"/>
                                    </div>
                                    <h2 className="scroll-m-20 text-2xl font-poppins-semibold tracking-tight first:mt-0">
                                        Pedidos
                                    </h2>
                                </div>
                                <div className="space-y-4 h-max lg:flex lg:flex-1 lg:flex-col">
                                    <Header/>
                                    <div
                                        className={`flex flex-1 rounded-2xl w-full `}>
                                        {
                                            orders.length == 0 ?
                                                <div
                                                    className="lg:flex lg:flex-col justify-center items-center overflow-y-hidden lg:flex-grow w-full">
                                                    <h1 className="text-lg font-poppins-semibold ">
                                                        Nenhum pedido encontrado.
                                                    </h1>
                                                    <h2 className="text-sm font-poppins-regular text-zinc-500">
                                                        Assim que algum cliente efetuar algum pedido, podera encontrar
                                                        aqui.
                                                    </h2>
                                                </div> :
                                                <>
                                                    <div
                                                        className={`transition-all lg:flex lg:flex-col lg:flex-1 overflow-y-hidden lg:flex-grow duration-150 ease-in-out w-full ${orderSelected === null ? 'w-full' : 'lg:w-3/5'}`}>
                                                        <ScrollArea className="w-full rounded-l-2xl lg:flex-1 lg:flex lg:flex-col">
                                                            <div className=" ">
                                                                <OrdersDisplay/>
                                                            </div>
                                                        </ScrollArea>
                                                    </div>
                                                    {
                                                        isDesktop ?
                                                            <div
                                                                className={` transition-all duration-150 ease-in-out ${orderSelected === null ? 'lg:hidden' : 'lg:block'}`}>
                                                                {orderSelected && <OrderInfo order={orderSelected}/>}
                                                            </div> :
                                                            <MobileOrderInfo order={orderSelected}
                                                                             setOrder={handleState}/>
                                                    }
                                                </>
                                        }
                                    </div>
                                </div>
                            </div>

                        </OrdersTrackingContext.Provider>
                    }
                </div>
            }
        </div>
    );
}