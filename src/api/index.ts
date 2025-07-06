import ApiClient from "@/api/api-client";
import axios from "axios";
import {apiClient} from "@/api/axios";

export const api = new ApiClient();


export const stockItemClient = axios.create({
    ...apiClient.defaults,
    baseURL: `${apiClient.defaults.baseURL}/stock`,
})