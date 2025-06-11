import {useCallback} from "react";
import {useParams} from "react-router";
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


const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

export function OrdersTracking() {

    const {restaurantID} = useParams() as unknown as { restaurantID: string };

    const isDesktop = useIsMobile()

    const {api} = config

    document.title = "Gestão de Pedidos"

    const { restaurant } = useDashboardContext()

    const newOrdersWsUrl = `${protocol}//${api.apiUrl}/ws/${restaurantID}/order`;
    const billedOrdersWsUrl = `${protocol}//${api.apiUrl}/ws/${restaurantID}/billed`;

    const {state: filterMode, handleState: setFilterMode} = useSelectedState<Filter>(FILTERS[0])
    const {state: tableFilter, handleState: handleTableFilterChange} = useSelectedState<string | null>(null)
    const {state: orderSelected, handleState} = useSelectedState<Order | null>(null)
    const {state: sorting, handleState: handleSortingChange} = useSelectedState<"asc" | "desc">("asc")

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
        <div>
            {
                orders != undefined &&
                <div>
                    <Background className="bg-zinc-100"/>
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
                            <div className="p-4 laptop:h-screen laptop:flex laptop:flex-col">
                                <div className="mt-4 mb-8 flex space-x-1.5 items-center">
                                    <div
                                        className="w-8 h-8 rounded-full bg-zinc-50 border border-zinc-300 flex justify-center items-center">
                                        <BowlFood className="w-6 h-6 text-zinc-800"/>
                                    </div>
                                    <h2 className="scroll-m-20 text-2xl font-poppins-semibold tracking-tight first:mt-0">
                                        Pedidos
                                    </h2>
                                </div>
                                <div className="space-y-4 h-max laptop:flex laptop:flex-grow laptop:flex-col">
                                    <Header/>
                                    <div
                                        className={`flex flex-grow rounded-2xl w-full laptop:bg-zinc-50 laptop:border laptop:border-zinc-200`}>
                                        {
                                            orders.length == 0 ?
                                                <div
                                                    className="laptop:flex laptop:flex-col justify-center items-center overflow-y-hidden laptop:flex-grow w-full">
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
                                                        className={`transition-all laptop:flex overflow-y-hidden laptop:flex-grow duration-150 ease-in-out w-full ${orderSelected === null ? 'w-full' : 'laptop:w-3/5'}`}>
                                                        <ScrollArea className="w-full rounded-l-2xl">
                                                            <div className="laptop:max-h-[20rem]">
                                                                <OrdersDisplay/>
                                                            </div>
                                                        </ScrollArea>
                                                    </div>
                                                    {
                                                        isDesktop ?
                                                            <div
                                                                className={`w-2/5 transition-all duration-150 ease-in-out ${orderSelected === null ? 'laptop:hidden' : 'laptop:block'}`}>
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

