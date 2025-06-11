import {useQuery} from "@tanstack/react-query";
import {ordersApi} from "@/api/endpoints/orders/requests";


export function useGetSessionOrders(sessionId: string | undefined){

    const queryKey = ["sesion orders", sessionId]

    return useQuery({
        queryKey,
        queryFn: () => sessionId? ordersApi.listSessionOrders(sessionId): undefined,
        enabled: typeof sessionId === "string",
    })

}