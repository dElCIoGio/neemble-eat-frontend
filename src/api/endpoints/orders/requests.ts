import {Order, OrderCreate, OrderPrepStatus} from "@/types/order";
import {apiClient} from "@/api/axios";


const baseRoute = "/orders"


export const ordersApi = {

    addOrder: async (orderData: OrderCreate, sessionId: string) => {
        const result = await apiClient.post(`${baseRoute}/`, {orderData, sessionId});
        return result.data;
    },

    listSessionOrders: async (sessionId: string) => {
        const result = await apiClient.get<Order[]>(`${baseRoute}/sessions/${sessionId}`)
        return result.data
    },

    getRecentOrders: async (restaurantId: string) => {
        const response = await apiClient.get<Order[]>(`${baseRoute}/restaurant/${restaurantId}/recent`)
        return response.data
    },

    updateOrderStatus: async (orderId: string, status: OrderPrepStatus) => {
        const response = await apiClient.put<Order>(`${baseRoute}/${orderId}/status`, status)
        return response.data
    }

}