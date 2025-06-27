import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {itemsApi} from "@/api/endpoints/item/requests";
import {CustomizationOption, CustomizationRule, PartialItem} from "@/types/item";
import {showSuccessToast, showErrorToast} from "@/utils/notifications/toast";

export function useGetItemBySlug(slug: string) {
    const queryKey = ["item", "slug", slug]

    return useQuery({
        queryKey,
        queryFn: () => itemsApi.getItemBySlug(slug),
        enabled: !!slug
    })
}

export function useUpdateItem() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({itemId, data}: {itemId: string, data: PartialItem}) => 
            itemsApi.updateItem(itemId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["item"]})
            showSuccessToast("Item updated successfully")
        },
        onError: () => {
            showErrorToast("Failed to update item")
        }
    })
}

export function useToggleItemAvailability() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (itemId: string) => itemsApi.switchItemAvailability(itemId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ["item"]})
            showSuccessToast(`Item is now ${data.isAvailable ? "available" : "unavailable"}`)
        },
        onError: () => {
            showErrorToast("Failed to update item availability")
        }
    })
}

export function useAddCustomization() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({itemId, customization}: {itemId: string, customization: CustomizationRule}) => 
            itemsApi.addCustomization(itemId, customization),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["item"]})
            showSuccessToast("Customization added successfully")
        },
        onError: () => {
            showErrorToast("Failed to add customization")
        }
    })
}

export function useUpdateCustomization() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({itemId, index, customization}: {itemId: string, index: number, customization: CustomizationRule}) => 
            itemsApi.updateCustomization(itemId, index, customization),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["item"]})
            showSuccessToast("Customization updated successfully")
        },
        onError: () => {
            showErrorToast("Failed to update customization")
        }
    })
}

export function useDeleteCustomization() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({itemId, index}: {itemId: string, index: number}) => 
            itemsApi.deleteCustomization(itemId, index),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["item"]})
            showSuccessToast("Customization deleted successfully")
        },
        onError: () => {
            showErrorToast("Failed to delete customization")
        }
    })
}

export function useAddCustomizationOption() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({itemId, index, option}: {itemId: string, index: number, option: CustomizationOption}) => 
            itemsApi.addCustomizationOption(itemId, index, option),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["item"]})
            showSuccessToast("Option added successfully")
        },
        onError: () => {
            showErrorToast("Failed to add option")
        }
    })
}

export function useUpdateCustomizationOption() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({itemId, customizationIndex, optionIndex, option}: {
            itemId: string,
            customizationIndex: number,
            optionIndex: number,
            option: CustomizationOption
        }) => itemsApi.updateCustomizationOption(itemId, customizationIndex, optionIndex, option),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["item"]})
            showSuccessToast("Option updated successfully")
        },
        onError: () => {
            showErrorToast("Failed to update option")
        }
    })
}

export function useDeleteCustomizationOption() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({itemId, customizationIndex, optionIndex}: {
            itemId: string,
            customizationIndex: number,
            optionIndex: number
        }) => itemsApi.deleteCustomizationOption(itemId, customizationIndex, optionIndex),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["item"]})
            showSuccessToast("Option deleted successfully")
        },
        onError: () => {
            showErrorToast("Failed to delete option")
        }
    })
}

export function useUpdateItemImage() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ itemId, file }: { itemId: string; file: File }) =>
            itemsApi.updateItemImage(itemId, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["item"] })
            showSuccessToast("Item image updated successfully")
        },
        onError: () => {
            showErrorToast("Failed to update item image")
        }
    })
}