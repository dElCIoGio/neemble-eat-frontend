import {apiClient} from "@/api/axios";
import {Supplier, SupplierCreate} from "@/types/stock";

const baseRoute = "/suppliers";

export const suppliersApi = {
    listSuppliers: async (restaurantId: string) => {
        const response = await apiClient.get<Supplier[]>(`${baseRoute}/restaurant/${restaurantId}`);
        return response.data;
    },

    createSupplier: async (data: SupplierCreate) => {
        const response = await apiClient.post<Supplier>(`${baseRoute}`, data);
        return response.data;
    },

    updateSupplier: async (id: string, data: Partial<Supplier>) => {
        const response = await apiClient.put<Supplier>(`${baseRoute}/${id}`, data);
        return response.data;
    },

    deleteSupplier: async (id: string) => {
        const response = await apiClient.delete(`${baseRoute}/${id}`);
        return response.data;
    },
};
