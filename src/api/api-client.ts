import {AxiosRequestConfig, AxiosResponse} from "axios";
import {apiClient} from "./axios.ts";
import config from "@/config.ts";
import {ApiResponse} from "@/api/types.ts";


class ApiService {

    private readonly prefix: string;

    constructor(prefix?: string) {
        this.prefix = prefix || "";
    }

    private static handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> {

        console.debug("API Response:", response);

        if (!response || typeof response !== "object") {
            console.error("Invalid response format:", response);
            throw new Error("Unexpected response structure from the API.");
        }

        if (config.app.env === "development") {
            console.debug("Raw API Response:", response);
        }

        const { success, error } = response.data;

        if (!success) {
            console.error("API Error:", error?.message || "Unknown error");
            throw new Error(error?.message || "API request failed.");
        }

        // if (data === undefined || data === null) {
        //     console.error("API returned empty data:", response);
        //     throw new Error("API response contains no data.");
        // }

        if (response.data === null || response.data === undefined) {
            console.error("API returned empty data:", response);
            throw new Error("API response contains no data,");
        }

        return response.data;
    }

    async get<T>(url?: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const fullUrl = this.prefix + (url || "");
        const response = await apiClient.get<ApiResponse<T>>(fullUrl, config);
        return ApiService.handleResponse<T>(response);
    }

    async post<T>(url?: string, data?: Record<string, unknown> | FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const fullUrl = this.prefix + (url || "");
        const response = await apiClient.post<ApiResponse<T>>(fullUrl, data, config);
        return ApiService.handleResponse<T>(response);
    }

    async put<T>(url?: string, data?: Record<string, unknown> | FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const fullUrl = this.prefix + (url || "");
        const response = await apiClient.put<ApiResponse<T>>(fullUrl, data, config);
        return ApiService.handleResponse<T>(response);
    }

    async del<T>(url?: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const fullUrl = this.prefix + (url || "");
        const response = await apiClient.delete<ApiResponse<T>>(fullUrl, config);
        return ApiService.handleResponse<T>(response);
    }
}

export default ApiService;


