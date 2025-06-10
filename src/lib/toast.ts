import { toast } from "sonner"

export function showSuccessToast(title: string, options?: { description?: string }) {
    toast.success(title, {
        description: options?.description,
        duration: 3000
    })
}

export function showErrorToast(title: string, description?: string) {
    toast.error(title, {
        description,
        duration: 5000
    })
}

export function showPromiseToast<T>(
    promise: Promise<T>,
    messages: {
        loading: string
        success: string
        error: string
    }
) {
    return toast.promise(promise, {
        loading: messages.loading,
        success: messages.success,
        error: messages.error
    })
} 