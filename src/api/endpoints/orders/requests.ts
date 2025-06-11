import {OrderCreate} from "@/types/order";
import {apiClient} from "@/api/axios";


const baseRoute = "/orders"


export const ordersApi = {

    addOrder: async (orderData: OrderCreate, sessionId: string) => {
        const result = await apiClient.post(`${baseRoute}/`, {orderData, sessionId});
        return result.data;
    }

}