import axios from "axios";
import { apiClient } from "@/api/axios";

export const salesReportsClient = axios.create({
    ...apiClient.defaults,
    baseURL: `${apiClient.defaults.baseURL}/reports/sales`,
});

export const invoicesReportsClient = axios.create({
    ...apiClient.defaults,
    baseURL: `${apiClient.defaults.baseURL}/reports/invoices`,
});
