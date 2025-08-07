import {useParams} from "react-router";
import {useEffect, useState} from "react";

import Background from "@/components/ui/background";
import ReturnNav from "@/components/ui/return-nav";
import {useGetActiveSessionByTableNumber} from "@/api/endpoints/sessions/hooks";
import {useGetSessionOrders} from "@/api/endpoints/orders/hooks";
import {NoOrders} from "@/components/pages/restaurant-menu-orders/no-orders";
import {OrdersDisplay} from "@/components/pages/restaurant-menu-orders/orders-display";
import {BillsAlert} from "@/components/pages/restaurant-menu-orders/bills-alert";
import {OrdersContext} from "@/context/order-context";
import {Payment} from "@/components/pages/restaurant-menu-orders/payment";
import {Loader} from "@/components/ui/loader";
import {useRestaurantMenuContext} from "@/context/restaurant-menu-context";


export function Orders() {

    document.title = "Pedidos"

    const {
        restaurant
    } = useRestaurantMenuContext()

    const {
        tableNumber,
    } = useParams() as unknown as {
        re: string,
        menuID: string,
        tableNumber: number
    };

    const [customerName, ] = useState<string>("")
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [billRequested, setBillRequested] = useState<boolean>(false);

    const {
        data: session,
        error: sessionError,
        isLoading: isSessionLoading,
    } = useGetActiveSessionByTableNumber({
        tableNumber: tableNumber,
        restaurantId: restaurant._id
    })

    const {
        data: orders,
        error: ordersError,
        isFetching: isFetchingOrders,
        refetch: refreshOrders,
        cleanList
    } = useGetSessionOrders(session?._id)

    useEffect(() => {
        if (session)
            setBillRequested(session.status === "needs bill")

    }, [session, session?.status]);


    if (ordersError || sessionError) {
        return <div>
            {sessionError && <div>
                There was an error while fetchin the session: {sessionError.message}
            </div>
            }
            {ordersError && <div>
                There was an error while fetchin the orders: {ordersError.message}
            </div>
            }
        </div>
    }

    if (isFetchingOrders || isSessionLoading) {
        return (
            <div className="flex-1 flex justify-center items-center">
                <Loader/>
            </div>
        )
    }

    return (
        <OrdersContext.Provider value={{
            refreshOrders: refreshOrders,
            orders: orders,
            isFetchingOrders: isFetchingOrders,
            customerName,
            cleanList,
            setBillDialogOpen: setIsPopupOpen,
            billRequested,
            setBillRequested,
        }}>
            <div className="p-4">
                <Background className={`bg-gray-100`}/>
                <ReturnNav path={`..`} title={"Pedidos"}/>
                <div>
                    <h1 className='text-lg font-semibold'>
                        Pedidos recentes
                    </h1>
                    <p className='text-sm text-zinc-600'>
                        Abaixo estão os seus pedidos
                    </p>
                </div>
                <div>
                    {
                        orders ? (
                            orders.length === 0 ? <NoOrders/> : <>
                                <OrdersDisplay/>
                                <Payment/>
                            </>
                        ) : <NoOrders/>
                    }
                </div>

                <BillsAlert open={isPopupOpen} onOpenChange={(isOpen) => setIsPopupOpen(isOpen)}/>
            </div>

        </OrdersContext.Provider>
    );
}

