import {apiClient} from "@/api/axios";
import {PartialRole, Role, RoleCreate} from "@/types/role";


const baseRoute = "/roles"

export const roleApi = {

    createRole: async (roleData: RoleCreate) => {
        const response = await apiClient.post<Role>(`${baseRoute}/`, roleData)
        return response.data
    },

    getRole: async (roleId: string) => {
        const response = await apiClient.get<Role>(`${baseRoute}/${roleId}`)
        return response.data
    },

    listRestaurantRoles: async (restaurantId: string) => {
        const response = await apiClient.get<Role[]>(`${baseRoute}/restaurant/${restaurantId}`)
        return response.data
    },

    updateRole: async (roleId: string, updateData: PartialRole) => {
        const response = await apiClient.put<Role>(`${baseRoute}/${roleId}`, updateData)
        return response.data
    },

    deleteRole: async (roleId: string) => {
        const response = await apiClient.delete<boolean>(`${baseRoute}/${roleId}`)
        return response.data
    }

}