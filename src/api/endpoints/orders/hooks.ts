import {useQuery, useQueryClient} from "@tanstack/react-query";
import {ordersApi} from "@/api/endpoints/orders/requests";
import {Order} from "@/types/order";


export function useGetSessionOrders(sessionId: string | undefined){

    const queryKey = ["sesion orders", sessionId]

    const queryClient = useQueryClient();


    const cleanList = () => {
        queryClient.setQueryData<Order[]>(queryKey, () => {
            return [] as Order[];
        });
    };

     const query = useQuery({
        queryKey,
        queryFn: () => sessionId? ordersApi.listSessionOrders(sessionId): undefined,
        enabled: typeof sessionId === "string",
    })

    return {
         ...query,
        cleanList,
    }

}


export function useGetRecentOrders(restaurantId: string){

    const queryKey = ["recent orders", restaurantId]

    const queryClient = useQueryClient();

    function removeOrders(ids: string[]) {
        queryClient.setQueryData(queryKey, (oldOrders: Order[] = []) => {
            return oldOrders.filter(order => !ids.includes(order._id))
        })
    }

    function updateOrderStatus(orderId: string, newStatus: string) {
        queryClient.setQueryData(queryKey, (oldOrders: Order[] = []) => {
            return oldOrders.map(order =>
                order._id === orderId ? {...order, prepStatus: newStatus} : order
            );
        });
    }

    function addOrder(order: Order) {
        console.log("ADDING ORDER:")
        console.log(order);
        queryClient.setQueryData(queryKey, (oldOrders: Order[] = []) => {

            return oldOrders.some(o => o._id === order._id) ? oldOrders : [...oldOrders, order];
        });
    }

    const query = useQuery({
        queryKey,
        queryFn: () => ordersApi.getRecentOrders(restaurantId)
    })

    return {
        removeOrders,
        updateOrderStatus,
        addOrder,
        ...query
    }

}