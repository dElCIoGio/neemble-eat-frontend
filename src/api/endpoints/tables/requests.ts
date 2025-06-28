import {PartialTable, Table, TableCreate} from "@/types/table";
import {apiClient} from "@/api/axios";


const baseRoute = "/tables"

export const tableApi = {

    createTable: async (tableData: TableCreate) => {
        const response = await apiClient.post<Table>(`${baseRoute}/`, tableData)
        return response.data
    },

    getTable: async (tableId: string) => {
        const response = await apiClient.get<Table>(`${baseRoute}/${tableId}`)
        return response.data
    },

    listRestaurantTables: async (restaurantId: string) => {
        const response = await apiClient.get<Table[]>(`${baseRoute}/restaurant/${restaurantId}`)
        return response.data
    },

    updateTable: async (tableId: string, tableData: PartialTable) => {
        const response = await apiClient.put<Table>(`${baseRoute}/${tableId}`, tableData)
        return response.data
    },

    deleteTable: async (tableId: string) => {
        const response = await apiClient.delete<boolean>(`${baseRoute}/${tableId}`)
        return response.data
    },

    cleanTable: async (tableId: string) => {
      const response = await apiClient.post<Table>(`${baseRoute}/${tableId}/clean`);
      return response.data
    }

}