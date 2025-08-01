import {apiClient} from "@/api/axios";
import {CustomizationOption, CustomizationRule, Item, PartialItem} from "@/types/item";


const baseRoute = "/items"



export const itemsApi = {

    createItem: async (formData: FormData) => {
        const response = await apiClient.post<Item>(`${baseRoute}/`, formData)
        return response.data
    },

    deleteItem: async (itemId: string) => {
        const response = await apiClient.delete(`${baseRoute}/${itemId}`)
        return response.data
    },

    getItemBySlug : async (slug: string) => {
        const response = await apiClient.get<Item>(`${baseRoute}/${slug}/slug`)
        return response.data
    },

    getItem: async (itemId: string) => {
        const response = await apiClient.get<Item>(`${baseRoute}/${itemId}`)
        return response.data
    },

    updateItem: async (itemId: string, itemData: PartialItem) => {
        const response = await apiClient.put<Item>(`${baseRoute}/${itemId}`, itemData)
        return response.data
    },

    switchItemAvailability: async (itemId: string) => {
        const response = await apiClient.put<Item>(`${baseRoute}/${itemId}/availability`)
        return response.data
    },

    addCustomization: async (itemId: string, customization: CustomizationRule) => {
        const response = await apiClient.post<Item>(`${baseRoute}/${itemId}/customizations`, customization)
        return response.data
    },

    updateCustomization: async (itemId: string, index: number, customization: CustomizationRule) => {
        const response = await apiClient.put<Item>(`${baseRoute}/${itemId}/customizations/${index}`, customization)
        return response.data
    },

    deleteCustomization: async (itemId: string, index: number) => {
        const response = await apiClient.delete<Item>(`${baseRoute}/${itemId}/customizations/${index}`)
        return response.data
    },

    addCustomizationOption: async (itemId: string, index: number, option: CustomizationOption) => {
        const response = await apiClient.post<Item>(`${baseRoute}/${itemId}/customizations/${index}`, option)
        return response.data
    },

    updateCustomizationOption: async (itemId: string, customizationIndex: number, optionIndex: number, option: CustomizationOption) => {
        const response = await apiClient.put<Item>(`${baseRoute}/${itemId}/customizations/${customizationIndex}/options/${optionIndex}`, option)
        return response.data
    },

    deleteCustomizationOption: async (itemId: string, customizationIndex: number, optionIndex: number) => {
        const response = await apiClient.delete(`${itemId}/customizations/${customizationIndex}/options/${optionIndex}`)
        return response.data
    },

    updateItemImage: async (itemId: string, file: File) => {
        const formData = new FormData();
        formData.append('imageFile', file);
        const response = await apiClient.put<Item>(`${baseRoute}/${itemId}/image`, formData)
        return response.data

    }

}
