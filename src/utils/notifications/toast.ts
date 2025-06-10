import { toast } from 'sonner';

export const showSuccessToast = (message: string): void => {
    toast.success(message, {
        duration: 3000,
        position: 'top-right',
    });
};

export const showErrorToast = (message: string, description?: string): void => {
    toast.error(message, {
        description: description? description : "",
        duration: 5000,
        position: 'top-right',
    });
};

export const showWarningToast = (message: string): void => {
    toast.warning(message, {
        duration: 4000,
        position: 'top-right',
    });
};

export const showInfoToast = (message: string): void => {
    toast.info(message, {
        duration: 3000,
        position: 'top-right',
    });
};

export const showLoadingToast = (message: string) => {
    toast.loading(message, {
        position: 'top-right',
    });
};

export const dismissToast = (toastId: string): void => {
    toast.dismiss(toastId);
};

export const showPromiseToast = <T>(
    promise: Promise<T>,
    {
        loading = 'Loading...',
        success = 'Success!',
        error = 'Something went wrong',
    }: {
        loading?: string;
        success?: string;
        error?: string;
    } = {}
) => {
    return toast.promise(promise, {
        loading,
        success,
        error,
    });
};

export const showCustomToast = (
    message: string,
    {
        type = 'default',
        duration = 3000,
        position = 'top-right',
    }: {
        type?: 'default' | 'success' | 'error' | 'warning' | 'info';
        duration?: number;
        position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    } = {}
): void => {
    toast(message, {
        duration,
        position,
        className: `toast-${type}`,
    });
}; 