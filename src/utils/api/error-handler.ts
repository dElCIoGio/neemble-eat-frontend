import { AxiosError } from 'axios';

export class ApiError extends Error {
    constructor(
        public status: number,
        public message: string,
        public code?: string,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export const handleApiError = (error: unknown): ApiError => {
    if (error instanceof ApiError) {
        return error;
    }

    if (error instanceof AxiosError) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
        const code = error.response?.data?.code;
        const data = error.response?.data;

        return new ApiError(status, message, code, data);
    }

    if (error instanceof Error) {
        return new ApiError(500, error.message);
    }

    return new ApiError(500, 'An unexpected error occurred');
};

export const isNetworkError = (error: unknown): boolean => {
    if (error instanceof AxiosError) {
        return !error.response;
    }
    return false;
};

export const isServerError = (error: unknown): boolean => {
    if (error instanceof ApiError) {
        return error.status >= 500;
    }
    return false;
};

export const isClientError = (error: unknown): boolean => {
    if (error instanceof ApiError) {
        return error.status >= 400 && error.status < 500;
    }
    return false;
};

export const isAuthError = (error: unknown): boolean => {
    if (error instanceof ApiError) {
        return error.status === 401 || error.status === 403;
    }
    return false;
}; 