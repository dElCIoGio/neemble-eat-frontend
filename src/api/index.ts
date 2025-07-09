import ApiClient from "@/api/api-client";
import axios from "axios";
import {apiClient} from "@/api/axios";

export const api = new ApiClient();


export const stockItemClient = axios.create({
    ...apiClient.defaults,
    baseURL: `${apiClient.defaults.baseURL}/stock`,
})


export const stockMovementClient = axios.create({
    ...apiClient.defaults,
    baseURL: `${apiClient.defaults.baseURL}/movements`,
})

export const recipesClient = axios.create({
    ...apiClient.defaults,
    baseURL: `${apiClient.defaults.baseURL}/recipes`,
})